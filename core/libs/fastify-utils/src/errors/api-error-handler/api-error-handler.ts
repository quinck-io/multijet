import { ApiError, ApiErrorsLookupService } from '@libs/api-errors'
import { ErrorCode, ErrorData } from '@libs/models'
import { isPresent } from '@libs/utils'
import { FastifyError, FastifyInstance } from 'fastify'
import { StatusCodes } from 'http-status-codes'

export type ErrorHandler = Parameters<FastifyInstance['setErrorHandler']>[0]

export const apiErrorHandler = (
    apiErrorsLookupService: ApiErrorsLookupService,
): ErrorHandler =>
    function (error, request, reply) {
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

    if (isPresent((error as FastifyError).validation)) {
        const errorData = validationErrorData(error as FastifyError)

        return [StatusCodes.BAD_REQUEST, errorData]
    }

    // TODO: add different handling for operational and non operation errors?

    if (apiErrorsLookupService.hasMapping(error.name)) {
        const apiErrorParser = apiErrorsLookupService.getParser(error.name)
        const apiError = apiErrorParser(error)
        const errorData = buildErrorData(error, apiError)

        return [apiError.status, errorData]
    }

    const errorData = buildErrorData(error)
    return [StatusCodes.INTERNAL_SERVER_ERROR, errorData]
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

const buildErrorData = (error: Error, apiError?: ApiError): ErrorData => ({
    errorCode: apiError?.errorCode ?? ErrorCode._500_INTERNAL_SERVER_ERROR,
    description: error.message,
})

// function isOperationalError(error: Error): error is OperationalError {
//     return error instanceof OperationalError && error.isOperational
// }

// ---------------------------------------------------------------------------------------------- //

// export const apiErrorHandler: ErrorHandler = function (error, request, reply) {
//     // TODO: make possible to pass a context to use for logs, like controller names before this update
//     this.log.error(error)

//     const [statusCode, errorData] = errorResponseInformation(error)

//     reply.status(statusCode).send(errorData)
// }

// function errorResponseInformation(error: Error): [StatusCodes, ErrorData] {
//     if (!isPresent(error)) {
//         const errorData: ErrorData = {
//             errorCode: ErrorCode._500_INTERNAL_SERVER_ERROR,
//             description: '',
//         }

//         return [StatusCodes.INTERNAL_SERVER_ERROR, errorData]
//     }

//     if (isPresent((error as FastifyError).validation)) {
//         const errorData = validationErrorData(error as FastifyError)

//         return [StatusCodes.BAD_REQUEST, errorData]
//     }

//     if (isServiceError(error)) {
//         const errorData = serviceErrorToErrorData(error)

//         return [error.code, errorData]
//     }

//     const errorData: ErrorData = {
//         errorCode: ErrorCode._500_INTERNAL_SERVER_ERROR,
//         description: error.message,
//     }

//     return [StatusCodes.INTERNAL_SERVER_ERROR, errorData]
// }

// function isServiceError(error: Error): error is ServiceError {
//     return error instanceof ServiceError
// }

// function serviceErrorToErrorData(error: ServiceError): ErrorData {
//     return {
//         errorCode: error.name,
//         description: error.message,
//         inputId: error.inputId,
//     }
// }
