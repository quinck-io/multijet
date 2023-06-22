import { ErrorCode } from '@libs/models'
import { StatusCodes } from 'http-status-codes'
import { ApiErrorParser } from './api-errors-lookup-service.models'

/**
 * The default parser the get ApiError from an error.
 * @returns the parser to be used to retrieve error information
 */
export const defualtApiErrorParser: ApiErrorParser = () => ({
    errorCode: ErrorCode.GENERIC,
    status: StatusCodes.INTERNAL_SERVER_ERROR,
})
