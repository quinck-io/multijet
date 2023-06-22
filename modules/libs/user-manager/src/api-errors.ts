import { ApiErrorMappings } from '@libs/api-errors'
import { ErrorCode } from '@libs/models'
import {
    ForceChangePasswordException,
    InvalidParameterError,
    InvalidPasswordError,
    UnauthorizedError,
    UnknownInternalError,
    UserAlreadyExistsError,
    UserNotFoundError,
    UserNotRetrievedError,
    WrongUsernameOrPasswordError,
} from '@quinck/aws-cognito-client'
import { StatusCodes } from 'http-status-codes'

export const userManagerErrors = (): ApiErrorMappings => ({
    [UserAlreadyExistsError.name]: () => ({
        errorCode: ErrorCode._409_CONFLICT,
        status: StatusCodes.CONFLICT,
    }),
    [UnauthorizedError.name]: () => ({
        errorCode: ErrorCode._401_UNAUTHORIZED_NOT_AUTHENTICATED,
        status: StatusCodes.UNAUTHORIZED,
    }),
    [UserNotFoundError.name]: () => ({
        errorCode: ErrorCode._404_NOT_FOUND,
        status: StatusCodes.NOT_FOUND,
    }),
    [InvalidPasswordError.name]: () => ({
        errorCode: ErrorCode._401_UNAUTHORIZED_NOT_AUTHENTICATED,
        status: StatusCodes.UNAUTHORIZED,
    }),
    [UnknownInternalError.name]: () => ({
        errorCode: ErrorCode._500_INTERNAL_SERVER_ERROR,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
    }),
    [InvalidParameterError.name]: () => ({
        errorCode: ErrorCode._500_INTERNAL_SERVER_ERROR,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
    }),
    [UserNotRetrievedError.name]: () => ({
        errorCode: ErrorCode._500_INTERNAL_SERVER_ERROR,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
    }),
    [WrongUsernameOrPasswordError.name]: () => ({
        errorCode: ErrorCode._401_UNAUTHORIZED_NOT_AUTHENTICATED,
        status: StatusCodes.UNAUTHORIZED,
    }),
    [UserAlreadyExistsError.name]: () => ({
        errorCode: ErrorCode._409_USER_ALREADY_EXISTS,
        status: StatusCodes.CONFLICT,
    }),
    [ForceChangePasswordException.name]: () => ({
        errorCode: ErrorCode._400_BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST,
    }),
})
