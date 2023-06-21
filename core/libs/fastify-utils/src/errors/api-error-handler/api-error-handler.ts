import { ApiError, ApiErrorsLookupService } from '@libs/api-errors'
import { ErrorCode, ErrorData } from '@libs/models'
import { FastifyInstance } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import {
    ValidationError,
    getInputId,
    isValidationError,
} from '../../input-validation/input-validation'

export type ErrorHandler = Parameters<FastifyInstance['setErrorHandler']>[0]

export const apiErrorHandler = (
    apiErrorsLookupService: ApiErrorsLookupService,
): ErrorHandler =>
    function (error, _, reply) {
        this.log.error(error)

        const [statusCode, errorData] = errorResponseInformation(
            apiErrorsLookupService,
            error,
        )

        reply.status(statusCode).send(errorData)
    }

const errorResponseInformation = (
    apiErrorsLookupService: ApiErrorsLookupService,
    optionalError?: Error,
): [StatusCodes, ErrorData] => {
    const error = optionalError ?? Error()

    if (isValidationError(error)) {
        const errorData = validationErrorData(error)

        return [StatusCodes.BAD_REQUEST, errorData]
    }

    if (apiErrorsLookupService.hasMapping(error.name)) {
        const apiErrorParser = apiErrorsLookupService.getParser(error.name)
        const apiError = apiErrorParser(error)
        const errorData = buildErrorData(error, apiError)

        return [apiError.status, errorData]
    }

    const errorData = buildErrorData(error)
    return [StatusCodes.INTERNAL_SERVER_ERROR, errorData]
}

function validationErrorData(error: ValidationError): ErrorData {
    const errorData: ErrorData = {
        errorCode: ErrorCode._400_BAD_REQUEST,
        description: error.message,
    }

    const inputId = getInputId(error)
    if (inputId) errorData.inputId = inputId

    return errorData
}

const buildErrorData = (error: Error, apiError?: ApiError): ErrorData => ({
    errorCode: apiError?.errorCode ?? ErrorCode._500_INTERNAL_SERVER_ERROR,
    description: error.message,
})
