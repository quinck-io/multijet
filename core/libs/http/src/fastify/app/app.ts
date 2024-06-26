import { createApiErrorsLookupService, defaultMappings } from "@libs/api-errors"
import fastify, { FastifyPluginAsync } from "fastify"
import { apiErrorHandler } from "../../errors/api-error-handler/api-error-handler"
import { DEFAULT_OPTIONS } from "./app.consts"
import { ApplicationOptions } from "./app.models"
import { decorateAppWithCors } from "./cors.app"

export const serverApp = (opts?: ApplicationOptions) => {
    const app = fastify(opts?.fastifyOptions ?? DEFAULT_OPTIONS)

    app.apiErrorsLookupService = createApiErrorsLookupService()
    app.apiErrorsLookupService.putMappings(defaultMappings())

    app.setErrorHandler(apiErrorHandler)

    app.addContentTypeParser("application/json", { parseAs: "string" }, (_, body: string, done) => {
        try {
            const isBodyEmpty = body == undefined || body == null || body == ""
            if (isBodyEmpty) done(null)
            else done(null, JSON.parse(body))
        } catch (err) {
            done(err as Error, null)
        }
    })

    appOptions(app, opts ?? {})

    return app
}

const appOptions: FastifyPluginAsync<ApplicationOptions> = async (app, opts) => {
    if (opts) {
        const { cors, healthCheck } = opts

        decorateAppWithCors(app, cors)

        if (healthCheck) app.all(healthCheck.path, (_, reply) => reply.send())
    }
}
