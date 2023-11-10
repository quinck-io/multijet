import {
    ApiErrorsLookupService,
    createApiErrorsLookupService,
} from '@libs/api-errors'
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import { apiErrorHandler } from '../../errors/api-error-handler/api-error-handler'
import { DEFAULT_OPTIONS } from './app.consts'
import { ApplicationOptions } from './app.models'
import { decorateAppWithCors } from './cors.app'

export const defaultApp = (
    fastifyOptions: FastifyServerOptions = DEFAULT_OPTIONS,
    appOptions?: ApplicationOptions,
    apiErrorsLookupService: ApiErrorsLookupService = createApiErrorsLookupService(),
) => {
    const app = fastify(fastifyOptions)

    app.setErrorHandler(apiErrorHandler(apiErrorsLookupService))

    app.addContentTypeParser(
        'application/json',
        { parseAs: 'string' },
        (_, body: string, done) => {
            try {
                const isBodyEmpty =
                    body == undefined || body == null || body == ''
                if (isBodyEmpty) done(null)
                else done(null, JSON.parse(body))
            } catch (err) {
                done(err as Error, null)
            }
        },
    )

    applyApplicationOptions(app, appOptions)

    return app
}

function applyApplicationOptions(
    app: FastifyInstance,
    options?: ApplicationOptions,
): FastifyInstance {
    if (options) {
        const { cors, healthCheck } = options

        decorateAppWithCors(app, cors)

        if (healthCheck) app.all(healthCheck.path, (_, reply) => reply.send())
    }
    return app
}
