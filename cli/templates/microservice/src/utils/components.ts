export interface AppComponents {
    message: string
}

export function createAppComponents(): AppComponents {
    return { message: 'world' }
}
