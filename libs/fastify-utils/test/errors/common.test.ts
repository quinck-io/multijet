import 'mocha'
import {
    BadRequestError,
    ConflictError,
    FrobiddenError,
    InternalServerError,
    NotImplementedError,
    ServiceError,
    TooManyRequestsError,
} from '../../src'
import { FASTIFY_UTILS } from '../labels'

describe(`${FASTIFY_UTILS} errors common`, () => {
    const errors: (new () => ServiceError)[] = [
        BadRequestError,
        ConflictError,
        InternalServerError,
        TooManyRequestsError,
        NotImplementedError,
        FrobiddenError,
    ]

    errors.forEach(ServiceErrorClass => {
        it(`should allow to create ${ServiceErrorClass}`, () => {
            new ServiceErrorClass()
        })
    })
})
