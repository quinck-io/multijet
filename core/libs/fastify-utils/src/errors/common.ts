import { ErrorCode } from '@libs/models'
import { StatusCodes } from 'http-status-codes'
import { ServiceError } from './errors'

export class BadRequestError extends ServiceError {
    constructor(error?: Error, inputId?: string) {
        super(
            StatusCodes.BAD_REQUEST,
            ErrorCode._400_BAD_REQUEST,
            error,
            inputId,
        )
    }
}

export class ConflictError extends ServiceError {
    constructor(error?: Error) {
        super(StatusCodes.CONFLICT, ErrorCode._409_CONFLICT, error)
    }
}

export class InternalServerError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorCode._500_INTERNAL_SERVER_ERROR,
            error,
        )
    }
}

export class TooManyRequestsError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.TOO_MANY_REQUESTS,
            ErrorCode._429_TOO_MANY_REQUESTS,
            error,
        )
    }
}

export class NotImplementedError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.NOT_IMPLEMENTED,
            ErrorCode._501_NOT_IMPLEMENTED_ERROR,
            error,
        )
    }
}

export class UnauthorizedError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.UNAUTHORIZED,
            ErrorCode._401_UNAUTHORIZED_NOT_AUTHENTICATED,
            error,
        )
    }
}

export class FrobiddenError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.FORBIDDEN,
            ErrorCode._403_FORBIDDEN_NOT_AUTHORIZED,
            error,
        )
    }
}
