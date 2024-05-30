import { AwilixContainer } from "awilix"
import { FastifyInstance } from "fastify"

declare module "fastify" {
    interface FastifyRequest {
        scopedContainer: AwilixContainer
    }
}

type WithServices = { services?: object }

export function diScope<Services extends object>(app: FastifyInstance, container: AwilixContainer<Services>) {
    app.addHook("preHandler", async request => {
        request.scopedContainer = container.createScope()
        ;(request as WithServices).services = request.scopedContainer.cradle
    })

    app.addHook("onClose", async () => {
        await container.dispose()
    })

    app.addHook("onResponse", async request => {
        await request.scopedContainer.dispose()
    })
}
