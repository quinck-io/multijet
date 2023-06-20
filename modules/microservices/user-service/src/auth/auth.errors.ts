import { BadRequestError, ConflictError } from '@libs/fastify-utils'

export class ForceChangePasswordError extends ConflictError {
    constructor() {
        super(new Error('The user must change the password before login'))
    }
}

export class WrongEmailOrPasswordError extends BadRequestError {
    constructor() {
        super(new Error('The user entered a wrong email or password'))
    }
}

export class PasswordFormatError extends BadRequestError {
    constructor() {
        super(
            new Error(
                'Password must satisfy regular expression pattern: ^\\S.*\\S$',
            ),
        )
    }
}
