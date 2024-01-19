import pino, { LoggerOptions } from "pino"
import { Logger, LoggerExtensions } from "./logger.models"

export const extendLogger = <Options = LoggerOptions>(
    logger: pino.Logger<Options>,
): Logger<Options> => {
    const extensions: LoggerExtensions = {
        log: logger.debug,
        extendedChild: (bindings, options) =>
            extendLogger(logger.child(bindings, options)),
    }
    return Object.assign(logger, extensions)
}
