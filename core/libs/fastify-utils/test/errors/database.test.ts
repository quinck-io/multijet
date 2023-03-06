import 'mocha'
import { ServiceError } from '../../src'
import {
    ItemNotCreatedError,
    ItemNotDeletedError,
    ItemNotFoundError,
    ItemNotRetrievedError,
    ItemNotUpdatedError,
    ItemsSearchError,
} from '../../src/errors/database'
import { FASTIFY_UTILS } from '../labels'

describe(`${FASTIFY_UTILS} errors database`, () => {
    const errors: (new () => ServiceError)[] = [
        ItemNotCreatedError,
        ItemNotDeletedError,
        ItemNotFoundError,
        ItemNotRetrievedError,
        ItemNotUpdatedError,
        ItemsSearchError,
    ]

    errors.forEach(ServiceErrorClass => {
        it(`should allow to create ${ServiceErrorClass}`, () => {
            new ServiceErrorClass()
        })
    })
})
