import { expect } from 'chai'
import 'mocha'
import { ErrorCode } from '../../../src'
import { FASTIFY_UTILS } from '../../labels'
import { TestBasicController } from './basic-controller.mock'

describe(`${FASTIFY_UTILS} fastify controllers basic-controller`, () => {
    describe('when asked to parse an error into an error response', () => {
        it('should set the error code with an internal server error if the specified error is null', () => {
            const controller = new TestBasicController()
            const errorResponse = controller.errorToErrorResponseCaller(null)
            expect(errorResponse.errorCode).to.be.deep.equal(
                ErrorCode._500_INTERNAL_SERVER_ERROR,
            )
        })

        it('should set the error code with an internal server error if the specified error is undefined', () => {
            const controller = new TestBasicController()
            const errorResponse =
                controller.errorToErrorResponseCaller(undefined)
            expect(errorResponse.errorCode).to.be.deep.equal(
                ErrorCode._500_INTERNAL_SERVER_ERROR,
            )
        })

        it('should set the error code with an internal server error with any specified error', () => {
            const controller = new TestBasicController()
            const errorResponse = controller.errorToErrorResponseCaller(
                new Error(),
            )
            expect(errorResponse.errorCode).to.be.deep.equal(
                ErrorCode._500_INTERNAL_SERVER_ERROR,
            )
        })

        it('should set the error description to include the name and the message of the specified error', () => {
            const controller = new TestBasicController()
            const errorName = 'ErrorName'
            const errorMessage = 'error message'
            const error = new Error(errorMessage)
            error.name = errorName
            const errorResponse = controller.errorToErrorResponseCaller(error)

            expect(errorResponse.description).to.include(errorName)
            expect(errorResponse.description).to.include(errorMessage)
        })
    })
})
