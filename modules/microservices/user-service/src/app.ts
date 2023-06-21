import { createApiErrorsLookupService } from '@libs/api-errors'
import { defaultApp, diScope } from '@libs/fastify-utils'
import { FastifyServerOptions } from 'fastify'
import { adminRoutesErrors } from './admin/admin.errors'
import { authRoutesErrors } from './auth/auth.errors'
import { appContainer } from './di-container'
import { createRoutes } from './routes'

export const createApp = (opts?: FastifyServerOptions) => {
    const errorsLookupService = createApiErrorsLookupService()
    errorsLookupService.putMappings(adminRoutesErrors())
    errorsLookupService.putMappings(authRoutesErrors())

    const app = defaultApp(opts, undefined, errorsLookupService)

    diScope(app, appContainer(), request => {
        request.services = request.scopedContainer.cradle
    })

    createRoutes().forEach(({ config, handler }) =>
        app.route({ ...config, handler }),
    )

    return app
}
