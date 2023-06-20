import { BadRequestError, ConflictError } from '@libs/fastify-utils'

export class InvalidCustomerIdError extends BadRequestError {
    constructor() {
        super(new Error('customerId cannot include special characters'))
    }
}

export class AccountAlreadyExistsError extends ConflictError {
    constructor() {
        super(new Error(AccountAlreadyExistsError.name))
    }
}
