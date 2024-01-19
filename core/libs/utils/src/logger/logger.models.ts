import pino from "pino"

export type Logger<Options = pino.LoggerOptions> = pino.Logger<Options> &
    LoggerExtensions

export type LoggerExtensions<Options = pino.LoggerOptions> = {
    log: pino.LogFn
    extendedChild: (
        ...params: Parameters<pino.Logger<Options>["child"]>
    ) => Logger<Options>
}
