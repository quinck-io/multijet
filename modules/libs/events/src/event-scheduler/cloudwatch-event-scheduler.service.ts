import {
    CloudWatchEventsClient,
    DeleteRuleCommand,
    PutRuleCommand,
    PutTargetsCommand,
    RemoveTargetsCommand,
    RuleState,
} from "@aws-sdk/client-cloudwatch-events"
import { logger } from "@libs/utils"
import { v4 as uuidv4 } from "uuid"
import {
    EventSchedulerService,
    Schedule,
    ScheduleEvent,
    ScheduledEvent,
} from "./event-scheduler.models"

export type CloudWatchEventSchedulerServiceParams = {
    eventHandler: string
}

export class CloudWatchEventSchedulerService implements EventSchedulerService {
    constructor(
        private readonly params: CloudWatchEventSchedulerServiceParams,
    ) {}

    public async schedule(event: ScheduleEvent): Promise<ScheduledEvent> {
        const eventId = uuidv4()

        const scheduledEvent: ScheduledEvent = {
            eventId,
            schedule: event.schedule,
            createdAt: Date.now(),
            metadata: event.metadata,
            type: event.type,
        }

        try {
            await this.cloudwatchSchedule(
                scheduledEvent,
                this.scheduleToCron(event.schedule),
            )

            logger.info({ scheduledEvent })
        } catch (error) {
            logger.error({ error })

            await this.unschedule(eventId)

            throw error
        }

        return scheduledEvent
    }

    public async unschedule(eventId: string): Promise<void> {
        try {
            const client = new CloudWatchEventsClient()
            await client.send(
                new RemoveTargetsCommand({ Rule: eventId, Ids: [eventId] }),
            )
            await client.send(new DeleteRuleCommand({ Name: eventId }))

            logger.info({ eventId })
        } catch (error) {
            logger.error({ error })
        }
    }

    private async cloudwatchSchedule(
        event: ScheduledEvent,
        cron: string,
    ): Promise<void> {
        const { eventHandler } = this.params

        const client = new CloudWatchEventsClient()
        await client.send(
            new PutRuleCommand({
                Name: event.eventId,
                ScheduleExpression: cron,
                State: RuleState.ENABLED,
            }),
        )

        await client.send(
            new PutTargetsCommand({
                Rule: event.eventId,
                Targets: [
                    {
                        Arn: eventHandler,
                        Id: event.eventId,
                        Input: JSON.stringify(event),
                    },
                ],
            }),
        )
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

        return `cron(${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
            date.getMonth() + 1
        } ? ${date.getFullYear()})`
    }
}
