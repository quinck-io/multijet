import {
    FastifyUtilsComponents,
    fastifyUtilsContainer,
} from '@libs/fastify-utils'
import { getEnvironment } from '@libs/utils'
import {
    AwilixContainer,
    asClass,
    asFunction,
    asValue,
    createContainer,
} from 'awilix'
import { AppFactory, createApp } from './app'
import { HelloController } from './hello/hello.controller'
import { RoutesFactory, createRoutes } from './routes'
import { Environment, JoiEnvironmentValidationSchema } from './utils/env'

export type AppComponents = FastifyUtilsComponents & {
    message: string
    helloController: HelloController
    createRoutes: RoutesFactory
    createApp: AppFactory
    environment: Environment
}

export function appContainer(): AwilixContainer<AppComponents> {
    const fastifyUtils = fastifyUtilsContainer()

    const container = createContainer<AppComponents>({}, fastifyUtils)

    container.register({
        environment: asValue(getEnvironment(JoiEnvironmentValidationSchema)),
        message: asValue('world'),
        helloController: asClass(HelloController).scoped(),
        createRoutes: asFunction<RoutesFactory>(createRoutes).singleton(),
        createApp: asFunction<AppFactory>(createApp).singleton(),
    })

    return container
}
