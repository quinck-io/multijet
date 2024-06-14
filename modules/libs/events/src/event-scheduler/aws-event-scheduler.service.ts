import {
    CreateScheduleCommand,
    DeleteScheduleCommand,
    FlexibleTimeWindowMode,
    SchedulerClient,
    ScheduleState,
} from "@aws-sdk/client-scheduler"
import { logger } from "@libs/utils"
import { v4 as uuid } from "uuid"
import {
    EventSchedulerService,
    Schedule,
    ScheduledEvent,
    ScheduleEvent,
} from "./event-scheduler.models"

export type Params = {
    eventHandler: string
    roleArn: string
}

export class AWSEventSchedulerService implements EventSchedulerService {
    private constructor(private readonly params: Params) {}

    public static readonly create = (params: Params) => () =>
        new AWSEventSchedulerService(params)

    public async schedule(event: ScheduleEvent): Promise<ScheduledEvent> {
        const eventId = event.eventId ?? uuid()

        const scheduledEvent: ScheduledEvent = {
            ...event,
            eventId,
            createdAt: Date.now(),
        }

        try {
            await this.awsSchedule(
                scheduledEvent,
                this.scheduleToCron(event.schedule),
            )

            logger.info({ scheduledEvent })
        } catch (error) {
            logger.error(`Failed to schedule event ${eventId}`)
            logger.error({ error })

            await this.unschedule(eventId)
        }

        return scheduledEvent
    }

    public async unschedule(eventId: string): Promise<void> {
        try {
            const scheduler = new SchedulerClient()
            await scheduler.send(new DeleteScheduleCommand({ Name: eventId }))

            logger.info({ eventId })
        } catch (error) {
            logger.error({ error })
        }
    }

    private async awsSchedule(
        event: ScheduledEvent,
        cron: string,
    ): Promise<void> {
        const { eventHandler, roleArn } = this.params

        const scheduler = new SchedulerClient()
        const cmd = new CreateScheduleCommand({
            State: ScheduleState.ENABLED,
            Name: event.eventId,
            Target: {
                Arn: eventHandler,
                Input: JSON.stringify(event),
                RoleArn: roleArn,
            },
            ScheduleExpression: cron,
            FlexibleTimeWindow: {
                Mode: FlexibleTimeWindowMode.OFF,
            },
            ActionAfterCompletion: "DELETE",
        })

        await scheduler.send(cmd)
    }

    private scheduleToCron(schedule: Schedule): string {
        switch (schedule.type) {
            case "cron":
                return schedule.cron
            case "timestamp":
                return this.timestampToCron(schedule.timestamp)
        }
    }

    private timestampToCron(timestamp: number): string {
        const date = new Date(timestamp)

        return `cron(${date.getUTCMinutes()} ${date.getUTCHours()} ${date.getUTCDate()} ${
            date.getUTCMonth() + 1
        } ? ${date.getUTCFullYear()})`
    }
}
