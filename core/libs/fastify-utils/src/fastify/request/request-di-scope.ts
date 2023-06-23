import { AwilixContainer } from 'awilix'
import { FastifyInstance, FastifyRequest } from 'fastify'

declare module 'fastify' {
    interface FastifyRequest {
        scopedContainer: AwilixContainer
    }
}

export function diScope<Services extends object>(
    app: FastifyInstance,
    container: AwilixContainer<Services>,
    addServicesToRequest: (request: FastifyRequest) => void,
) {
    app.addHook('preHandler', async request => {
        request.scopedContainer = container.createScope()
        addServicesToRequest(request)
    })

    app.addHook('onClose', async () => {
        await container.dispose()
    })

    app.addHook('onResponse', async request => {
        await request.scopedContainer.dispose()
    })
}
