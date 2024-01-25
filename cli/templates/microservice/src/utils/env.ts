import Joi from "joi"

export type Environment = {
    ENVIRONMENT: string
}

export const JoiEnvironmentValidationSchema = Joi.object<Environment>()
    .keys({
        ENVIRONMENT: Joi.string().required(),
    })
    .required()
    .unknown()
