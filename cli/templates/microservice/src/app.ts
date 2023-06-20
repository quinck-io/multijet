import { defaultApp } from '@libs/fastify-utils'
import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { createRoutes } from './routes'
import { AppComponents } from './utils/components'

export function buildApp(
    components: AppComponents,
    opts?: FastifyServerOptions,
): FastifyInstance {
    const app = defaultApp(opts)
    const routes = createRoutes(components)
    routes.forEach(({ config, handler }) => app.route({ ...config, handler }))

    return app
}
