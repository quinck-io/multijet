import { Handlers } from '@libs/fastify-utils'

export class HelloController {
    constructor(private readonly message: string) {}

    public getHello: Handlers['getHelloWorld'] = async () => ({
        hello: this.message,
    })
}
