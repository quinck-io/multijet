import { expect } from 'chai'
import { StatusCodes } from 'http-status-codes'
import 'mocha'
import { UNKNOWN_ERROR } from '../../../src/fastify/controllers/fastify-controller.consts'
import { FASTIFY_UTILS } from '../../labels'
import {
    createApp,
    MockFastifyController,
    MOCK_ERROR,
    MOCK_ERROR_MESSAGE,
    MOCK_ERROR_RESPONSE,
    MOCK_NAME,
    MOCK_NULL_ERROR_RESPONSE,
    MOCK_SERVICE_ERROR,
    MOCK_SERVICE_ERROR_RESPONSE,
    MOCK_UNDEFINED_ERROR_RESPONSE,
    throwingErrorHandler,
    throwingNullHandler,
    throwingServiceErrorHandler,
    throwingUndefinedHandler,
} from './fastify-controller.mock'

describe(`${FASTIFY_UTILS} fastify controllers fastify-controller`, () => {
    describe('when created', () => {
        it('should allow to specify a custom name to identify the controller, i.e. for logs', () => {
            const controller = new MockFastifyController(MOCK_NAME)

            expect(controller).to.not.be.null
            expect(controller).to.not.be.undefined
        })
    })

    describe('when asked to tryDo an handler', () => {
        it('should handle a null error', async () => {
            const app = createApp()

            const result = await app
                .inject()
                .get(`/${throwingNullHandler.name}`)

            expect(result.statusCode).to.be.equal(
                StatusCodes.INTERNAL_SERVER_ERROR,
            )
            expect(JSON.parse(result.body)).to.be.deep.equal(
                MOCK_NULL_ERROR_RESPONSE,
            )
        })

        it('should handle an undefined error', async () => {
            const app = createApp()

            const result = await app
                .inject()
                .get(`/${throwingUndefinedHandler.name}`)

            expect(result.statusCode).to.be.equal(
                StatusCodes.INTERNAL_SERVER_ERROR,
            )
            expect(JSON.parse(result.body)).to.be.deep.equal(
                MOCK_UNDEFINED_ERROR_RESPONSE,
            )
        })

        it('should handle any error', async () => {
            const app = createApp()
            const result = await app
                .inject()
                .get(`/${throwingErrorHandler.name}`)

            expect(result.statusCode).to.be.equal(
                StatusCodes.INTERNAL_SERVER_ERROR,
            )
            expect(JSON.parse(result.body)).to.be.deep.equal(
                MOCK_ERROR_RESPONSE,
            )
        })

        it('should handle a service error', async () => {
            const app = createApp()
            const result = await app
                .inject()
                .get(`/${throwingServiceErrorHandler.name}`)

            expect(result.statusCode).to.be.equal(MOCK_SERVICE_ERROR.code)
            expect(JSON.parse(result.body)).to.be.deep.equal(
                MOCK_SERVICE_ERROR_RESPONSE,
            )
        })
    })

    describe('when asked to parse an error', () => {
        it('should return an unknown error if the error is undefined', () => {
            const controller = new MockFastifyController(MOCK_NAME)
            const error = controller.parseErrorCaller(undefined)
            expect(error.message).to.be.equal(UNKNOWN_ERROR)
        })

        it('should return an unknown error if the error is null', () => {
            const controller = new MockFastifyController(MOCK_NAME)
            const error = controller.parseErrorCaller(null)
            expect(error.message).to.be.equal(UNKNOWN_ERROR)
        })

        it('should return the error if the error is an Error', () => {
            const controller = new MockFastifyController(MOCK_NAME)
            const error = controller.parseErrorCaller(MOCK_ERROR)
            expect(error).to.be.deep.equal(MOCK_ERROR)
        })

        it('should return an error with a message equal to the specified error if it is a string', () => {
            const controller = new MockFastifyController(MOCK_NAME)
            const error = controller.parseErrorCaller(MOCK_ERROR_MESSAGE)
            expect(error.message).to.be.equal(MOCK_ERROR_MESSAGE)
        })
    })
})
