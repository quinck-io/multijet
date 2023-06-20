import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { AppComponents } from './di-container'

export type AppParams = Pick<AppComponents, 'createRoutes' | 'defaultApp'>
export type AppFactory = (opts?: FastifyServerOptions) => FastifyInstance

export const createApp =
    ({ createRoutes, defaultApp }: AppParams): AppFactory =>
    opts => {
        const app = defaultApp(opts)

        const routes = createRoutes()

        routes.forEach(({ config, handler }) =>
            app.route({ ...config, handler }),
        )

        return app
    }
