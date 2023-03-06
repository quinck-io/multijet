import { expect } from 'chai'
import fastify from 'fastify'
import 'mocha'
import { decorateAppWithCors } from '../../../src/fastify/app/cors.app'
import { FASTIFY_UTILS } from '../../labels'

describe(`${FASTIFY_UTILS} fastify app cors.app`, () => {
    describe('when asked to enable corse in the application', () => {
        it('should not enable cors if cors options are not specified or undefined', () => {
            const app = fastify()
            const appAfterCors = decorateAppWithCors(app, undefined)
            expect(appAfterCors).to.be.deep.equal(app)
        })

        it('should not enable cors if cors options is false', () => {
            const app = fastify()
            const appAfterCors = decorateAppWithCors(app, false)
            expect(appAfterCors).to.be.deep.equal(app)
        })

        it('should enable cors with default configs if cors options is true', () => {
            const app = fastify()
            const result = decorateAppWithCors(app, true)
            expect(result).not.be.null
        })

        it('should enable cors with the specified configs if cors options is specified', () => {
            const app = fastify()
            const result = decorateAppWithCors(app, {
                origin: '*',
            })
            expect(result).not.be.null
        })
    })
})
