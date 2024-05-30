export interface EventSchedulerService {
    schedule(event: ScheduleEvent): Promise<ScheduledEvent>
    unschedule(eventId: string): Promise<void>
}

export type ScheduledEvent = ScheduleEvent & {
    eventId: string
    createdAt: number
}

export type ScheduleEvent = {
    eventId?: string
    type?: string
    schedule: Schedule
    metadata?: Record<string, unknown>
} & Record<string, unknown>

export type Schedule =
    | {
          type: "cron"
          cron: string
      }
    | {
          type: "timestamp"
          timestamp: number
      }
