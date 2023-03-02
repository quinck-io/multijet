import { LoggerOptions } from 'pino'
import { commonEnvironment } from '../env/env'
import { NodeEnv } from '../env/env.models'

export const commonOptions: LoggerOptions = {
    name: commonEnvironment?.LOGGER_NAME,
}

export const defaulLoggerOptions: LoggerOptions = {
    redact: ['req.headers.authorization'],
    level: 'info',
}

export const envToLogger: Map<NodeEnv, LoggerOptions> = new Map([
    [NodeEnv.production, defaulLoggerOptions],
    [NodeEnv.staging, { level: 'info' }],
    [NodeEnv.development, { level: 'trace' }],
    [NodeEnv.test, { level: 'trace' }],
])
