import { defaultApp } from '@libs/fastify-utils'
import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { AppComponents } from './utils/components'

export type AppParams = Pick<AppComponents, 'createRoutes'>
export type AppFactory = (opts?: FastifyServerOptions) => FastifyInstance

export const createApp =
    ({ createRoutes }: AppParams): AppFactory =>
    opts => {
        const app = defaultApp(opts)

        const routes = createRoutes()

        routes.forEach(({ config, handler }) =>
            app.route({ ...config, handler }),
        )

        return app
    }
