import Joi from 'joi'

export type Environment = {}

export const JoiEnvironmentValidationSchema = Joi.object<Environment>()
    .keys({})
    .unknown()
