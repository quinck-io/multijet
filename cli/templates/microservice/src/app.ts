import { defaultApp, diScope } from '@libs/fastify-utils'
import { FastifyServerOptions } from 'fastify'
import { appContainer } from './di-container'
import { createRoutes } from './routes'

export const createApp = (opts?: FastifyServerOptions) => {
    const app = defaultApp(opts)

    diScope(app, appContainer(), request => {
        request.services = request.scopedContainer.cradle
    })

    createRoutes().forEach(({ config, handler }) =>
        app.route({ ...config, handler }),
    )

    return app
}
