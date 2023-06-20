import { ErrorCode } from '@libs/models'
import { StatusCodes } from 'http-status-codes'
import { ServiceError } from './errors'

export class ItemNotFoundError extends ServiceError {
    constructor(error?: Error) {
        super(StatusCodes.NOT_FOUND, ErrorCode._404_NOT_FOUND, error)
    }
}

export class ItemNotCreatedError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorCode._500_NOT_CREATED,
            error,
        )
    }
}

export class ItemNotUpdatedError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorCode._500_NOT_UPDATED,
            error,
        )
    }
}

export class ItemNotDeletedError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorCode._500_NOT_DELETED,
            error,
        )
    }
}

export class ItemNotRetrievedError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorCode._500_NOT_RETRIEVED,
            error,
        )
    }
}

export class ItemsSearchError extends ServiceError {
    constructor(error?: Error) {
        super(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorCode._500_SEARCH_ERROR,
            error,
        )
    }
}
