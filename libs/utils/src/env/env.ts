import Joi from 'joi'
import { isPresent } from '../checks'
import { createLoggerFromEnv } from '../logger/logger.factory'
import { CommonEnvironment, NodeEnv } from './env.models'

export function getEnvironment<Environment extends NodeJS.ProcessEnv>(
    validationSchema: Joi.ObjectSchema<Environment>,
): Environment {
    const env = process.env

    const { error, warning, value } = validationSchema.validate(env)

    if (error) throw error
    if (warning) createLoggerFromEnv(NodeEnv.production).warn(warning)
    if (!isPresent(value)) throw new Error('Joi missing environment value')

    return value
}

export const JoiNodeEnvSchema = Joi.object<CommonEnvironment>()
    .keys({
        NODE_ENV: Joi.string()
            .valid(...Object.values(NodeEnv))
            .default(NodeEnv.production),
        LOGGER_NAME: Joi.string(),
    })
    .unknown()
    .required()

export const commonEnvironment = getEnvironment(JoiNodeEnvSchema)
