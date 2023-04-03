import { isPresent } from '@libs/utils'
import { FastifyError, FastifyInstance } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { ErrorCode, ErrorData } from '../../generated/openapi'
import { InternalServerError } from '../common'
import { ServiceError } from '../errors'

export type ErrorHandler = Parameters<FastifyInstance['setErrorHandler']>[0]

export const apiErrorHandler: ErrorHandler = function (error, request, reply) {
    // TODO: make possible to pass a context to use for logs, like controller names before this update
    this.log.error(error)

    const [statusCode, errorData] = errorResponseInformation(error)

    reply.status(statusCode).send(errorData)
}

function errorResponseInformation(error: Error): [StatusCodes, ErrorData] {
    if (!isPresent(error)) {
        const errorData = serviceErrorToErrorData(new InternalServerError())

        return [StatusCodes.INTERNAL_SERVER_ERROR, errorData]
    }

    if (isPresent((error as FastifyError).validation)) {
        const errorData = validationErrorData(error as FastifyError)

        return [StatusCodes.BAD_REQUEST, errorData]
    }

    if (isServiceError(error)) {
        const errorData = serviceErrorToErrorData(error)

        return [error.code, errorData]
    }

    const errorData: ErrorData = {
        errorCode: ErrorCode._500_INTERNAL_SERVER_ERROR,
        description: error.message,
    }

    return [StatusCodes.INTERNAL_SERVER_ERROR, errorData]
}

function isServiceError(error: Error): error is ServiceError {
    return error instanceof ServiceError
}

function validationErrorData(error: FastifyError): ErrorData {
    const errorData: ErrorData = {
        errorCode: ErrorCode._400_BAD_REQUEST,
        description: error.message,
    }

    // TODO: handle input validation => using fields of request
    // if (error.validation.length > 0) {
    //     const inputId = getInputId(request, validationError)
    //     if (inputId) data.inputId = inputId
    // }

    return errorData
}

function serviceErrorToErrorData(error: ServiceError): ErrorData {
    return {
        errorCode: error.name,
        description: error.message,
        inputId: error.inputId,
    }
}
