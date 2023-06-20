import { Handlers } from '@libs/fastify-utils'

export type HelloControllerParams = {
    message: string
}

export class HelloController {
    private readonly message: string

    constructor({ message }: HelloControllerParams) {
        this.message = message
    }

    public getHello: Handlers['getHelloWorld'] = async () => ({
        hello: this.message,
    })
}
