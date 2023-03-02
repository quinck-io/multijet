import pino, { LoggerOptions } from 'pino'
import { NodeEnv } from '../env/env.models'
import {
    commonOptions,
    defaulLoggerOptions,
    envToLogger,
} from './logger.consts'

export function createLoggerFromEnv(
    nodeEnv: NodeEnv,
): pino.Logger<LoggerOptions> {
    return createLogger(envToLogger.get(nodeEnv) ?? defaulLoggerOptions)
}

export function createLogger(
    options: LoggerOptions,
): pino.Logger<LoggerOptions> {
    return pino({ ...commonOptions, ...options })
}
