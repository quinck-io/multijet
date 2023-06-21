import { ApiErrorMappings } from '@libs/api-errors'
import { ErrorCode } from '@libs/models'
import { StatusCodes } from 'http-status-codes'

export class InvalidCustomerIdError extends Error {
    name = InvalidCustomerIdError.name
    constructor() {
        super('customerId cannot include special characters')
    }
}

export class AccountAlreadyExistsError extends Error {
    name = AccountAlreadyExistsError.name
}

export const adminRoutesErrors = (): ApiErrorMappings => ({
    [InvalidCustomerIdError.name]: () => ({
        errorCode: ErrorCode._400_BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST,
    }),
    [AccountAlreadyExistsError.name]: () => ({
        errorCode: ErrorCode._409_CONFLICT,
        status: StatusCodes.CONFLICT,
    }),
})
