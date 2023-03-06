import { Handlers } from '@libs/fastify-utils'
import { HelloController } from '../hello/hello.controller'

export interface AppComponents {
    message: string
}

export function createAppComponents(): AppComponents {
    return { message: 'world' }
}

export function createHandlers(components: AppComponents): Handlers {
    const helloController = new HelloController(components.message)

    return {
        getHelloWorld: helloController.getHello,
    }
}
