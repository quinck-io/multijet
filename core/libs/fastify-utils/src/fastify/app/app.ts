import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import { ErrorHandler } from '../../errors/api-error-handler/api-error-handler'
import { DEFAULT_OPTIONS } from './app.consts'
import { ApplicationOptions } from './app.models'
import { decorateAppWithCors } from './cors.app'

export type AppParams = {
    apiErrorHandler: ErrorHandler
}

export type AppFactory = (
    fastifyOptions?: FastifyServerOptions,
    appOptions?: ApplicationOptions,
) => FastifyInstance

export const defaultApp =
    ({ apiErrorHandler }: AppParams): AppFactory =>
    (fastifyOptions = DEFAULT_OPTIONS, appOptions) => {
        const app: FastifyInstance = fastify(fastifyOptions)

        app.addHook('onSend', async (request, reply, payload) => {
            return payload == 'null' ? '' : payload // TODO: the bug of empty returns in fastify has been fixed, this can be removed
        })

        app.setErrorHandler(apiErrorHandler)

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
