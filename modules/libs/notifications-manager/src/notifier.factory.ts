import { NotificationManager } from './notifier.models'
import { SNSNotificationManager } from './sns/sns-notifier'

// TODO: edit this type to your needs
export type NotificationContent = {
    message: string
}

export function createNotificationManager(): NotificationManager<NotificationContent> {
    return new SNSNotificationManager<NotificationContent>()
}
