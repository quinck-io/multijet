import { diScope, serverApp } from "@libs/http"
import { FastifyServerOptions } from "fastify"
import { appContainer } from "./di-container"
import { createRoutes } from "./routes"

export const createApp = async (opts?: FastifyServerOptions) => {
    const app = serverApp({ cors: true, fastifyOptions: opts })

    diScope(app, appContainer(), request => {
        request.services = request.scopedContainer.cradle
    })

    createRoutes().forEach(({ config, handler }) => app.route({ ...config, handler }))

    return app
}
