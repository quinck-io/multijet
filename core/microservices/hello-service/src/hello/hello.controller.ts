import { BasicController, Handler } from '@libs/fastify-utils'

export class HelloController extends BasicController {
    constructor(private readonly message: string) {
        super(HelloController.name)
    }

    public getHello: Handler<'getHelloWorld'> = this.tryDo(async () => {
        return {
            hello: this.message,
        }
    })
}
