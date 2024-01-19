import { NodeEnv } from "@libs/utils"
import winston, { LoggerOptions } from "winston"
import { Logger } from "../logger"
const { format, transports } = winston
const { Console } = transports
const { json } = format

const commonOptions: LoggerOptions = {
    levels: {
        ...winston.config.syslog.levels,
        fatal: 0,
        warn: 4,
        trace: 7,
    },
    format: json(),
    transports: [new Console()],
}

const defaulLoggerOptions: LoggerOptions = {
    ...commonOptions,
    level: "info",
}

const envToLogger: Map<NodeEnv, LoggerOptions> = new Map([
    [NodeEnv.production, defaulLoggerOptions],
    [NodeEnv.staging, defaulLoggerOptions],
    [NodeEnv.development, { ...commonOptions, level: "trace" }],
    [NodeEnv.test, { ...commonOptions, level: "silent" }],
])

const loggerOptionsByEnv = (nodeEnv?: NodeEnv) =>
    nodeEnv
        ? envToLogger.get(nodeEnv) ?? defaulLoggerOptions
        : defaulLoggerOptions

export const createWinstonLogger = (nodeEnv?: NodeEnv): Logger => {
    const createLogger = (): Logger => {
        const winstonLogger = winston.createLogger(loggerOptionsByEnv(nodeEnv))

        const log = (level: string) =>
            function (msg: any, ...args: any[]) {
                winstonLogger.log(level, msg, ...args)
            }

        return {
            level: winstonLogger.level,
            fatal: log("fatal"),
            error: log("error"),
            warn: log("warn"),
            info: log("info"),
            debug: log("debug"),
            trace: log("trace"),
            silent: function () {
                return void 0
            },
            child: function () {
                return createLogger()
            },
        }
    }

    return createLogger()
}
