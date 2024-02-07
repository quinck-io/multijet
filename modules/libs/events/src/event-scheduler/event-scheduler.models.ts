export interface EventSchedulerService {
    schedule(event: ScheduleEvent): Promise<ScheduledEvent>
    unschedule(eventId: string): Promise<void>
}

export type ScheduledEvent = {
    eventId: string
    type: string
    schedule: Schedule
    createdAt: number
    metadata?: Record<string, unknown>
}

export type ScheduleEvent = {
    type: string
    schedule: Schedule
    metadata?: Record<string, unknown>
}

export type Schedule =
    | {
          type: "cron"
          cron: string
      }
    | {
          type: "timestamp"
          timestamp: number
      }
