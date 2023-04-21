export interface NotificationManager<MessageType> {
    dispatch(target: string, message: MessageType): Promise<void>
}
