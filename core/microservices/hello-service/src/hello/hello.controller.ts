import { BasicController, Handlers } from '@libs/fastify-utils'

export type HelloControllerParams = {
    message: string
}

export class HelloController extends BasicController {
    private readonly message: string

    constructor({ message }: HelloControllerParams) {
        super(HelloController.name)
        this.message = message
    }

    public getHello: Handlers['getHelloWorld'] = this.tryDo(async () => {
        return {
            hello: this.message,
        }
    })
}
