import Joi from 'joi'

export type Environment = {
    USER_POOL_ID: string
    USER_CLIENT_ID: string
}

export const JoiEnvironmentValidationSchema = Joi.object<Environment>()
    .keys({
        USER_POOL_ID: Joi.string().required(),
        USER_CLIENT_ID: Joi.string().required(),
    })
    .unknown()
