import { createApiErrorsLookupService, defaultMappings } from '@libs/api-errors'
import { defaultApp, diScope } from '@libs/fastify-utils'
import { FastifyServerOptions } from 'fastify'
import { appContainer } from './di-container'
import { createRoutes } from './routes'

export const createApp = (opts?: FastifyServerOptions) => {
    const app = defaultApp(opts, { cors: true }, createErrorsLookupService())

    diScope(app, appContainer(), request => {
        request.services = request.scopedContainer.cradle
    })

    createRoutes().forEach(({ config, handler }) =>
        app.route({ ...config, handler }),
    )

    return app
}

const createErrorsLookupService = () => {
    const errorsLookupService = createApiErrorsLookupService()
    errorsLookupService.putMappings(defaultMappings())
    return errorsLookupService
}
