export class UnkownInternalError extends Error {
    name = UnkownInternalError.name

    constructor(message?: string) {
        const baseMessage = "An unknown error occurred"
        super(message ? `${baseMessage}: ${message}` : baseMessage)
    }
}

export class ResourceNotFoundError extends Error {
    name = ResourceNotFoundError.name
    constructor(message?: string) {
        const baseMessage = "Requested resource does not exist"
        super(message ? `${baseMessage}: ${message}` : baseMessage)
    }
}

export class ExpectedResourceNotFoundError extends ResourceNotFoundError {
    name = ExpectedResourceNotFoundError.name
    constructor(message?: string) {
        const baseMessage = "The resource should exist but it does not"
        super(message ? `${baseMessage}: ${message}` : baseMessage)
    }
}

export class ForbiddenError extends Error {
    name = ForbiddenError.name
    constructor(message?: string) {
        const baseMessage = "You are not allowed to access this resource"
        super(message ? `${baseMessage}: ${message}` : baseMessage)
    }
}

export class BadRequestError extends Error {
    name = BadRequestError.name
    constructor(message?: string) {
        const baseMessage = "Bad request"
        super(message ? `${baseMessage}: ${message}` : baseMessage)
    }
}

export class UserNotAuthenticatedError extends Error {
    name = UserNotAuthenticatedError.name
    constructor(message?: string) {
        const baseMessage = "You are not authenticated"
        super(message ? `${baseMessage}: ${message}` : baseMessage)
    }
}

export class InvalidCredentialsError extends Error {
    name = InvalidCredentialsError.name
    constructor(message?: string) {
        const baseMessage = "Wrong username or password"
        super(message ? `${baseMessage}: ${message}` : baseMessage)
    }
}

export class UserAlreadyExistsError extends Error {
    name = UserAlreadyExistsError.name
    constructor(message?: string) {
        const baseMessage = "User with given username already exists"
        super(message ? `${baseMessage}: ${message}` : baseMessage)
    }
}

export class UserNotFoundError extends Error {
    name = UserNotFoundError.name
    constructor(message?: string) {
        const baseMessage = "User with given username not found"
        super(message ? `${baseMessage}: ${message}` : baseMessage)
    }
}

export class ProfileNotCreatedError extends Error {
    name = ProfileNotCreatedError.name
    constructor(message?: string) {
        const baseMessage = "User exists but profile has not been created"
        super(message ? `${baseMessage}: ${message}` : baseMessage)
    }
}

export class ConflictError extends Error {
    name = ConflictError.name
    constructor(message?: string) {
        const baseMessage = "Resource already exists"
        super(message ? `${baseMessage}: ${message}` : baseMessage)
    }
}
