import fastify, { FastifyInstance } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { ErrorCode, ServiceError } from '../../../src'
import { FastifyController } from '../../../src/fastify/controllers/fastify-controller'

export const MOCK_NAME = 'MOCK_NAME'

export type MockErrorResponse = {
    message?: string
}

export class MockFastifyController extends FastifyController<MockErrorResponse> {
    protected errorToErrorResponse(error?: unknown): MockErrorResponse {
        return { message: String(error) }
    }
    protected serviceErrorToErrorResponse(
        error: ServiceError,
    ): MockErrorResponse {
        return {
            message: error.message,
        }
    }

    /**
     * Test added properties and methods
     */

    public tryDoCaller: MockFastifyController['tryDo'] = this.tryDo

    public parseErrorCaller = this.parseError
}

export type TryDoProp = Parameters<MockFastifyController['tryDo']>[0]

export const MOCK_REPLY_BODY = 'result'
export const MOCK_ERROR_MESSAGE = 'error message'
export const MOCK_ERROR = new Error(MOCK_ERROR_MESSAGE)
export const MOCK_SERVICE_ERROR: ServiceError = new ServiceError(
    StatusCodes.BAD_REQUEST,
    ErrorCode._400_BAD_REQUEST,
    MOCK_ERROR,
)
export const MOCK_ERROR_RESPONSE: MockErrorResponse = {
    message: String(MOCK_ERROR),
}

export const MOCK_UNDEFINED_ERROR_RESPONSE: MockErrorResponse = {
    message: String(undefined),
}

export const MOCK_NULL_ERROR_RESPONSE: MockErrorResponse = {
    message: String(null),
}

export const MOCK_SERVICE_ERROR_RESPONSE: MockErrorResponse = {
    message: MOCK_SERVICE_ERROR.message,
}

export const mockHander: TryDoProp = async () => {
    return MOCK_REPLY_BODY
}

export const throwingErrorHandler: TryDoProp = () => {
    throw MOCK_ERROR
}

export const throwingNullHandler: TryDoProp = () => {
    throw null
}

export const throwingUndefinedHandler: TryDoProp = () => {
    throw undefined
}

export const throwingServiceErrorHandler: TryDoProp = () => {
    throw MOCK_SERVICE_ERROR
}

export function createApp(): FastifyInstance {
    const app = fastify()

    const controller = new MockFastifyController(MOCK_NAME)

    app.get(
        `/${throwingErrorHandler.name}`,
        controller.tryDoCaller(throwingErrorHandler),
    )

    app.get(
        `/${throwingNullHandler.name}`,
        controller.tryDoCaller(throwingNullHandler),
    )

    app.get(
        `/${throwingUndefinedHandler.name}`,
        controller.tryDoCaller(throwingUndefinedHandler),
    )

    app.get(
        `/${throwingServiceErrorHandler.name}`,
        controller.tryDoCaller(throwingServiceErrorHandler),
    )

    return app
}
