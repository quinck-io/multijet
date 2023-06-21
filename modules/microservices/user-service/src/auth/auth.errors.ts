import { ApiErrorMappings } from '@libs/api-errors'
import { ErrorCode } from '@libs/models'
import { StatusCodes } from 'http-status-codes'

export class ForceChangePasswordError extends Error {
    constructor() {
        super('The user must change the password before login')
    }
}

export class WrongEmailOrPasswordError extends Error {
    constructor() {
        super('The user entered a wrong email or password')
    }
}

export class PasswordFormatError extends Error {
    constructor() {
        super('Password must satisfy regular expression pattern: ^\\S.*\\S$')
    }
}

export const authRoutesErrors = (): ApiErrorMappings => ({
    [ForceChangePasswordError.name]: () => ({
        errorCode: ErrorCode._400_BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST,
    }),
    [WrongEmailOrPasswordError.name]: () => ({
        errorCode: ErrorCode._401_UNAUTHORIZED_NOT_AUTHENTICATED,
        status: StatusCodes.UNAUTHORIZED,
    }),
    [PasswordFormatError.name]: () => ({
        errorCode: ErrorCode._400_BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST,
    }),
})
