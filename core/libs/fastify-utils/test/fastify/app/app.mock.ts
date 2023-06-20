import { FastifyServerOptions } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { defaultApp } from '../../../src'

export const MOCK_BODY = 'body'

export const noLoggerOpt: FastifyServerOptions = {
    logger: false,
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
}

export const genericError = new Error('generic error')
export const errorPath = '/error'
export const nullPath = '/null'
export const bodyPath = '/body'
export const bodyCheckedPath = '/bodyChecked'
export const getBody = '/getBody'

export const requestBodyRequiredProperty = 'requiredProperty'
export const getApp = () =>
    defaultApp({ apiErrorHandler: app => app })(noLoggerOpt)
        .get(errorPath, () => {
            throw genericError
        })
        .get(nullPath, () => null)
        .get(bodyPath, (req, res) => res.status(StatusCodes.OK).send(MOCK_BODY))
        .post(
            bodyCheckedPath,
            {
                schema: {
                    body: {
                        type: 'object',
                        required: [requestBodyRequiredProperty],
                        properties: {
                            [`${requestBodyRequiredProperty}`]: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
            () => null,
        )
        .post(getBody, (req, res) => res.send(req.body))
