import { serverApp } from "@libs/http"
import { FastifyServerOptions } from "fastify"
import { createRoutes } from "./routes"
import { appContainer } from "./utils/services"

export const createApp = async (opts?: FastifyServerOptions) => {
    const app = serverApp({ cors: true, fastifyOptions: opts, diContainer: appContainer() })

    createRoutes().forEach(({ config, handler }) => app.route({ ...config, handler }))

    return app
}
