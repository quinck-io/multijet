import { ErrorCode } from '@libs/fastify-utils'
import { StatusCodes } from 'http-status-codes'
import { ApiErrorInformationParser } from './api-errors-lookup-service.models'

/**
 * The default parser the get ApiErrorInformation from an error.
 * @returns the parser to be used to retrieve error information
 */
export const defualtApiErrorInformationParser: ApiErrorInformationParser =
    () => ({
        errorCode: ErrorCode._500_INTERNAL_SERVER_ERROR,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
    })
