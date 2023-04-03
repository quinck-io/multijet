import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import openapiFile from '../../../../../configs/openapi.json'
import { apiErrorHandler } from '../../errors/api-error-handler/api-error-handler'
import { Handlers } from '../../generated/openapi/handlers'
import { DEFAULT_OPTIONS } from './app.consts'
import { ApplicationOptions } from './app.models'
import { decorateAppWithCors } from './cors.app'

export function defaultApp(
    handlers: Handlers,
    fastifyOptions: FastifyServerOptions = DEFAULT_OPTIONS,
    appOptions?: ApplicationOptions,
): FastifyInstance {
    const app: FastifyInstance = fastify(fastifyOptions)

    app.addHook('onSend', async (request, reply, payload) => {
        return payload == 'null' ? '' : payload
    })

    app.setErrorHandler(apiErrorHandler)

    app.addContentTypeParser(
        'application/json',
        { parseAs: 'string' },
        (req, body: string, done) => {
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

    import('@quinck/fastify-openapi-glue').then(({ fastifyOpenapiGlue }) => {
        app.register(fastifyOpenapiGlue, {
            specification: openapiFile,
            service: handlers,
        })
    })

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

        if (healthCheck) app.all(healthCheck.path, async () => null)
    }
    return app
}
