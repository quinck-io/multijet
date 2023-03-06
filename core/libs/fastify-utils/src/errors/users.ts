import { StatusCodes } from 'http-status-codes'
import { ErrorCode } from '../generated/openapi'
import { ServiceError } from './errors'

export class UserAlreadyExistError extends ServiceError {
    constructor(error?: Error, inputId?: string) {
        super(
            StatusCodes.CONFLICT,
            ErrorCode._409_USER_ALREADY_EXISTS,
            error,
            inputId,
        )
    }
}

export class UserNotFoundError extends ServiceError {
    constructor(error?: Error) {
        super(StatusCodes.NOT_FOUND, ErrorCode._404_USER_NOT_FOUND, error)
    }
}

export class UserNotAuthenticatedError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.UNAUTHORIZED,
            ErrorCode._401_UNAUTHORIZED_NOT_AUTHENTICATED,
            error,
        )
    }
}

export class UserNotAuthorizedError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.FORBIDDEN,
            ErrorCode._403_FORBIDDEN_NOT_AUTHORIZED,
            error,
        )
    }
}

export class UserNotConfirmedError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.UNAUTHORIZED,
            ErrorCode._401_USER_NOT_CONFIRMED,
            error,
        )
    }
}

export class WrongOldPasswordError extends ServiceError {
    constructor(error?: Error) {
        super(400, ErrorCode._401_UPDATE_CREDENTIALS_OLD_PASSWORD_WRONG, error)
    }
}

export class UserDataNotFound extends ServiceError {
    constructor(error?: Error) {
        super(500, ErrorCode._500_USER_DATA_NOT_FOUND, error)
    }
}
