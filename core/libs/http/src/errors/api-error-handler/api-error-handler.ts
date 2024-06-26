import { ApiError, ApiErrorsLookupService } from "@libs/api-errors"
import { ErrorCode, ErrorData } from "@libs/models"
import { FastifyInstance } from "fastify"
import { StatusCodes } from "http-status-codes"
import {
    FastifyValidationError,
    getValidationErrors,
    isFastifyValidationError,
} from "../../input-validation/input-validation"
import { httpErrorsRfcType } from "./http-errors-rfc-types"

export type ErrorHandler = Parameters<FastifyInstance["setErrorHandler"]>[0]

export const apiErrorHandler: ErrorHandler = function (error, request, reply) {
    request.log.error(error)

    const [statusCode, errorData] = errorResponseInformation(this.apiErrorsLookupService, error)

    reply.status(statusCode).send(errorData)
}

const errorResponseInformation = (
    apiErrorsLookupService: ApiErrorsLookupService,
    optionalError?: Error,
): [StatusCodes, ErrorData] => {
    const error = optionalError ?? Error()

    if (isFastifyValidationError(error)) {
        const errorData = validationErrorData(error)

        return [errorData.status, errorData]
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

const validationErrorData = (error: FastifyValidationError) => {
    const errorData = buildErrorData(error, {
        title: ErrorCode.VALIDATION,
        status: StatusCodes.BAD_REQUEST,
    })
    errorData.validationErrors = getValidationErrors(error)

    return errorData
}

const buildErrorData = (error: Error, apiError?: ApiError): ErrorData => {
    const status = apiError?.status ?? StatusCodes.INTERNAL_SERVER_ERROR

    return {
        type: httpErrorsRfcType(status),
        title: apiError?.title ?? ErrorCode.GENERIC,
        detail: error.message,
        status,
    }
}
