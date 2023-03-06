import { expect } from 'chai'
import Joi from 'joi'
import 'mocha'

import { LibLabel } from '../../../test/unit/common/labels'
import { getEnvironment } from '../src/env/env'

export type Environment = {
    MY_PROP: string
    WARN_PROP: string
}

export const JoiEnvironmentValidationSchema = Joi.object<Environment>()
    .keys({
        MY_PROP: Joi.string().required(),
        WARN_PROP: Joi.string()
            .warning('custom.x', { w: 'world' })
            .message('hello {#w}!'),
    })
    .required()
    .unknown()

describe(`${LibLabel.UTILS} getEnvironment`, () => {
    beforeEach(() => {
        delete process.env.MY_PROP
        delete process.env.WARN_PROP
    })

    it('should return an object with the environment variables', () => {
        const value = 'value'
        process.env.MY_PROP = value
        process.env.WARN_PROP = value
        const env = getEnvironment(JoiEnvironmentValidationSchema)

        expect(env).to.have.property('MY_PROP', value)
        expect(env).to.have.property('WARN_PROP', value)
    })

    it('should throw a ValidationError if the environment model is not satisfied', () => {
        expect(
            getEnvironment.bind(getEnvironment, JoiEnvironmentValidationSchema),
        ).to.throw(Joi.ValidationError)
    })
})
