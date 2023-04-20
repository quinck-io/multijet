import fastifyMultipart from '@fastify/multipart'
import { defaultApp } from '@libs/fastify-utils'
import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { AppComponents, createHandlers } from './utils/app'

export function buildApp(
    components: AppComponents,
    opts?: FastifyServerOptions,
): FastifyInstance {
    const app = defaultApp(createHandlers(components), opts)
    app.register(fastifyMultipart)

    return app
}
