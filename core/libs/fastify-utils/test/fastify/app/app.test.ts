import { ErrorCode, ErrorData } from '@libs/models'
import { expect } from 'chai'
import { StatusCodes } from 'http-status-codes'
import 'mocha'
import { defaultApp } from '../../../src'
import { FASTIFY_UTILS } from '../../labels'
import {
    MOCK_BODY,
    bodyCheckedPath,
    bodyPath,
    errorPath,
    genericError,
    getApp,
    getBody,
    noLoggerOpt,
    nullPath,
    requestBodyRequiredProperty,
} from './app.mock'

describe(`${FASTIFY_UTILS} fastify app app defaultApp`, () => {
    describe('when asked to create a default fastify instance', () => {
        it('should create it without reporting any error', () => {
            expect(defaultApp.bind(defaultApp, {})).to.not.throw()
        })

        describe('application options', () => {
            it('should allow to specify application options', () => {
                expect(
                    defaultApp.bind(defaultApp, {}, noLoggerOpt, {}),
                ).to.not.throw()
            })

            it('should allow to specify the cors option', () => {
                expect(
                    defaultApp.bind(defaultApp, {}, noLoggerOpt, {
                        cors: true,
                    }),
                ).to.not.throw()
            })

            it('should setup the health check route correctly if specified', async () => {
                const healthCheckPath = '/health'
                const app = defaultApp(noLoggerOpt, {
                    healthCheck: {
                        path: healthCheckPath,
                    },
                })
                const response = await app.inject().get(healthCheckPath)
                expect(response.statusCode).to.be.equal(StatusCodes.OK)
            })
        })
    })

    describe('on reply', () => {
        it('should replace null payloads with empty string payloads', async () => {
            const app = getApp()
            app.get('/', () => null)
            const response = await app.inject().get(nullPath)
            expect(response.body).to.be.a.string('')
        })

        it('should reply with the status code specified by the handler', async () => {
            const app = getApp()
            const response = await app.inject().get(bodyPath)
            expect(response.statusCode).to.be.equal(StatusCodes.OK)
        })

        it('should reply with the budy specified by the handler', async () => {
            const app = getApp()
            const response = await app.inject().get(bodyPath)
            expect(response.body).to.be.equal(MOCK_BODY)
        })
    })

    describe('on errors', () => {
        describe('when a validation error is thrown', () => {
            it('should reply with a status code equal to 400', async () => {
                const app = getApp()
                const response = await app.inject().post(bodyCheckedPath)
                expect(response.statusCode).to.be.equal(StatusCodes.BAD_REQUEST)
            })

            it(`should reply with a body including ${ErrorCode.VALIDATION} as title`, async () => {
                const app = getApp()
                const response = await app.inject().post(bodyCheckedPath)
                const errorData = JSON.parse(response.body) as ErrorData
                expect(errorData.title).to.be.equal(ErrorCode.VALIDATION)
            })

            it('should reply with a body including the property that did not passed the validation in the detail', async () => {
                const app = getApp()
                const response = await app
                    .inject()
                    .post(bodyCheckedPath)
                    .body({})
                const errorData = JSON.parse(response.body) as ErrorData
                expect(errorData.detail).to.include(requestBodyRequiredProperty)
            })
        })

        describe('when an unhandled error is thrown', () => {
            it('should reply with a status code equal to 500', async () => {
                const app = getApp()
                const response = await app.inject().get(errorPath)
                expect(response.statusCode).to.be.equal(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                )
            })

            it(`should reply with a body including ${ErrorCode.GENERIC} as title`, async () => {
                const app = getApp()
                const response = await app.inject().get(errorPath)
                const errorData = JSON.parse(response.body) as ErrorData
                expect(errorData.title).to.be.equal(ErrorCode.GENERIC)
            })

            it('should reply with a body including the error message in the detail', async () => {
                const app = getApp()
                const response = await app.inject().get(errorPath)
                const errorData = JSON.parse(response.body) as ErrorData
                expect(errorData.detail).to.be.equal(genericError.message)
            })
        })
    })

    describe('when parsing a request body', () => {
        describe('application/json', () => {
            describe('should not set the body', () => {
                it('if it is an empty string', async () => {
                    const app = getApp()
                    const { body } = await app
                        .inject()
                        .post(getBody)
                        .headers({
                            'content-type': 'application/json',
                        })
                        .body('')
                    expect(body).to.be.string('')
                })

                it('if it is undefined', async () => {
                    const app = getApp()
                    const { body } = await app.inject().post(getBody).headers({
                        'content-type': 'application/json',
                    })
                    expect(body).to.be.string('')
                })
            })

            it('should parse the body as JSON correctly', async () => {
                const app = getApp()
                const jsonBody = {
                    foo: 'bar',
                }
                const { body } = await app
                    .inject()
                    .post(getBody)
                    .headers({
                        'content-type': 'application/json',
                    })
                    .body(jsonBody)
                expect(JSON.parse(body)).to.be.deep.equal(jsonBody)
            })

            it('should report an error if the payload is not a valid json', async () => {
                const app = getApp()
                const jsonBody = 'non valid json'
                const { statusCode } = await app
                    .inject()
                    .post(getBody)
                    .headers({
                        'content-type': 'application/json',
                    })
                    .body(jsonBody)
                expect(statusCode).to.be.equal(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                )
            })
        })
    })
})
