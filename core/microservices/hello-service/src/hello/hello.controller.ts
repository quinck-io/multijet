import { BasicController, Handlers } from '@libs/fastify-utils'

export class HelloController extends BasicController {
    constructor(private readonly message: string) {
        super(HelloController.name)
    }

    public getHello: Handlers['getHelloWorld'] = this.tryDo(async () => {
        return {
            hello: this.message,
        }
    })
}
