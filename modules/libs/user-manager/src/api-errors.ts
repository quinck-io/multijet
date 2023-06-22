import { ApiErrorMappings } from '@libs/api-errors'
import { ErrorCode } from '@libs/models'
import {
    ForceChangePasswordException,
    InvalidParameterError,
    InvalidPasswordError,
    UnauthorizedError,
    UserAlreadyExistsError,
    UserNotFoundError,
    UserNotRetrievedError,
    WrongUsernameOrPasswordError,
} from '@quinck/aws-cognito-client'
import { StatusCodes } from 'http-status-codes'

export const userManagerErrors = (): ApiErrorMappings => ({
    [UserAlreadyExistsError.name]: () => ({
        errorCode: ErrorCode.USER_ALREADY_EXISTS,
        status: StatusCodes.CONFLICT,
    }),
    [UnauthorizedError.name]: () => ({
        errorCode: ErrorCode.UNAUTHORIZED_NOT_AUTHENTICATED,
        status: StatusCodes.UNAUTHORIZED,
    }),
    [UserNotFoundError.name]: () => ({
        errorCode: ErrorCode.USER_NOT_FOUND,
        status: StatusCodes.NOT_FOUND,
    }),
    [InvalidPasswordError.name]: () => ({
        errorCode: ErrorCode.UNAUTHORIZED_NOT_AUTHENTICATED,
        status: StatusCodes.UNAUTHORIZED,
    }),
    [InvalidParameterError.name]: () => ({
        errorCode: ErrorCode.GENERIC,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
    }),
    [UserNotRetrievedError.name]: () => ({
        errorCode: ErrorCode.RESOURCE_NOT_RETRIEVED,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
    }),
    [WrongUsernameOrPasswordError.name]: () => ({
        errorCode: ErrorCode.UNAUTHORIZED_NOT_AUTHENTICATED,
        status: StatusCodes.UNAUTHORIZED,
    }),
    [ForceChangePasswordException.name]: () => ({
        errorCode: ErrorCode.UNAUTHORIZED_NOT_AUTHENTICATED,
        status: StatusCodes.UNAUTHORIZED,
    }),
})
