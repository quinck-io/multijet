import { ErrorCode } from '@libs/models'
import {
    BadRequestError,
    ConflictError,
    ExpectedResourceNotFoundError,
    ForbiddenError,
    InvalidCredentialsError,
    ResourceNotFoundError,
    UnkownInternalError,
    UserNotAuthenticatedError,
    UserNotFoundError,
} from '@libs/utils'
import { StatusCodes } from 'http-status-codes'
import { ApiErrorMappings } from '../lookup-service/api-errors-lookup-service.models'

export const defaultMappings = (): ApiErrorMappings => ({
    [ResourceNotFoundError.name]: () => ({
        status: StatusCodes.NOT_FOUND,
        errorCode: ErrorCode.RESOURCE_NOT_FOUND,
    }),
    [ExpectedResourceNotFoundError.name]: () => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        errorCode: ErrorCode.RESOURCE_NOT_RETRIEVED,
    }),
    [ForbiddenError.name]: () => ({
        status: StatusCodes.FORBIDDEN,
        errorCode: ErrorCode.FORBIDDEN_NOT_AUTHORIZED,
    }),
    [UserNotAuthenticatedError.name]: () => ({
        status: StatusCodes.UNAUTHORIZED,
        errorCode: ErrorCode.UNAUTHORIZED_NOT_AUTHENTICATED,
    }),
    [UnkownInternalError.name]: () => ({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        errorCode: ErrorCode.INTERNAL,
    }),
    [InvalidCredentialsError.name]: () => ({
        status: StatusCodes.UNAUTHORIZED,
        errorCode: ErrorCode.CREDENTIALS_NOT_VALID,
    }),
    [UserNotFoundError.name]: () => ({
        status: StatusCodes.NOT_FOUND,
        errorCode: ErrorCode.USER_NOT_FOUND,
    }),
    [ConflictError.name]: () => ({
        status: StatusCodes.CONFLICT,
        errorCode: ErrorCode.CONFLICT,
    }),
    [BadRequestError.name]: () => ({
        status: StatusCodes.BAD_REQUEST,
        errorCode: ErrorCode.BAD_REQUEST,
    }),
})
