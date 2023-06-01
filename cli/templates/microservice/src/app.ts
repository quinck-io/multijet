import { defaultApp, getHelloWorldRoute } from '@libs/fastify-utils'
import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { HelloController } from './hello/hello.controller'
import { AppComponents } from './utils/components'

export function createRoutes(
    app: FastifyInstance,
    components: AppComponents,
): FastifyInstance {
    const helloController = new HelloController(components.message)

    app.route({ ...getHelloWorldRoute, handler: helloController.getHello })

    return app
}

export function buildApp(
    components: AppComponents,
    opts?: FastifyServerOptions,
): FastifyInstance {
    const app = defaultApp(opts)
    createRoutes(app, components)

    return app
}
