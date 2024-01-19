/* eslint-disable @typescript-eslint/no-explicit-any */

import { NodeEnv } from "@libs/utils"
import { createWinstonLogger } from "./winston/winston"

export interface LogFunction {
    <T extends object>(obj: T, msg?: string, ...args: any[]): void
    (obj: unknown, msg?: string, ...args: any[]): void
    (msg: string, ...args: any[]): void
}

export interface Logger {
    level: string

    fatal: LogFunction
    error: LogFunction
    warn: LogFunction
    info: LogFunction
    debug: LogFunction
    trace: LogFunction
    silent: LogFunction

    child(): Logger
}

export const createLogger = (): Logger =>
    createWinstonLogger(process.env.NODE_ENV as NodeEnv)

export const logger = createLogger()
