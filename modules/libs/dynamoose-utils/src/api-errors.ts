import { ApiErrorMappings } from '@libs/api-errors'
import { ErrorCode } from '@libs/models'
import { StatusCodes } from 'http-status-codes'
import {
    MissingAttributesError,
    MissingItemError,
    NonValidCommandOutputError,
} from './dynamo/errors/dynamo.errors'

export const dynamooseUtilsErrors = (): ApiErrorMappings => ({
    [MissingAttributesError.name]: () => ({
        errorCode: ErrorCode._500_INTERNAL_SERVER_ERROR,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
    }),
    [MissingItemError.name]: () => ({
        errorCode: ErrorCode._500_INTERNAL_SERVER_ERROR,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
    }),
    [NonValidCommandOutputError.name]: () => ({
        errorCode: ErrorCode._500_INTERNAL_SERVER_ERROR,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
    }),
})
