import openapiGlue from '@quinck/fastify-openapi-glue'
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { ErrorCode, ErrorData } from '../../generated/openapi'
import { Handlers } from '../../generated/openapi/handlers'
import {
    FastifyValidationErrorWithMissingProps,
    getInputId,
} from '../../input-validation/input-validation'
import { DEFAULT_OPTIONS } from './app.consts'
import { ApplicationOptions } from './app.models'
import { decorateAppWithCors } from './cors.app'
// @ts-ignore
import openapiFile from '../../../../../configs/openapi.yml'

export function defaultApp(
    handlers: Handlers,
    fastifyOptions: FastifyServerOptions = DEFAULT_OPTIONS,
    appOptions?: ApplicationOptions,
): FastifyInstance {
    const app: FastifyInstance = fastify(fastifyOptions)

    app.addHook('onSend', async (request, reply, payload) => {
        return payload == 'null' ? '' : payload
    })

    app.setErrorHandler(function (error, request, reply) {
        if (error.validation) {
            const validationError =
                error as FastifyValidationErrorWithMissingProps
            const data: ErrorData = {
                errorCode: ErrorCode._400_BAD_REQUEST,
                description: validationError.message,
            }
            if (error.validation.length > 0) {
                const inputId = getInputId(request, validationError)
                if (inputId) data.inputId = inputId
            }
            reply.status(StatusCodes.BAD_REQUEST).send(data)
        } else {
            const data: ErrorData = {
                errorCode: ErrorCode._500_INTERNAL_SERVER_ERROR,
                description: error.message,
            }
            reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(data)
        }
    })

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

    app.register(openapiGlue, {
        specification: openapiFile,
        service: handlers,
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
