import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import { NotificationManager } from '../notifier.models'

export class SNSNotificationManager<MessageType>
    implements NotificationManager<MessageType>
{
    private client: SNSClient

    constructor() {
        this.client = new SNSClient({})
    }

    public async dispatch(target: string, message: MessageType): Promise<void> {
        const command = new PublishCommand({
            TargetArn: target,
            Message: JSON.stringify(message),
            MessageStructure: 'json',
        })

        await this.client.send(command)
    }
}
