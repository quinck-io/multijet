import { AwilixContainer, asFunction, asValue, createContainer } from "awilix"

declare module "fastify" {
    interface FastifyRequest {
        services: AppServices
    }
}

export type AppServices = {
    message: string
    dateTime: Date
}

export function appContainer(): AwilixContainer<AppServices> {
    const container = createContainer<AppServices>()

    container.register({
        message: asValue("world"),
        dateTime: asFunction(() => new Date()),
    })

    return container
}
