import { logger } from "@libs/utils"
import { FastifyServerOptions } from "fastify"

export const DEFAULT_OPTIONS: FastifyServerOptions = {
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
    logger,
}
