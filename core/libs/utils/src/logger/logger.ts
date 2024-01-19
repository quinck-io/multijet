import { commonEnvironment } from "../env/env"
import { createLoggerFromEnv } from "./logger.factory"
import { Logger } from "./logger.models"
import { extendLogger } from "./logger.utils"

export const logger: Logger = extendLogger(
    createLoggerFromEnv(commonEnvironment.NODE_ENV),
)
