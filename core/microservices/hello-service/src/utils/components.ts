import {
    AwilixContainer,
    asClass,
    asFunction,
    asValue,
    createContainer,
} from 'awilix'
import { AppFactory, createApp } from '../app'
import { HelloController } from '../hello/hello.controller'
import { RoutesFactory, createRoutes } from '../routes'

export enum Components {
    message = 'message',
    helloController = 'helloController',
    createRoutes = 'createRoutes',
    createApp = 'createApp',
}

export interface AppComponents {
    message: string
    helloController: HelloController
    createRoutes: RoutesFactory
    createApp: AppFactory
}

export function setupModuleContainer(): AwilixContainer<AppComponents> {
    const container = createContainer<AppComponents>()

    container.register({
        [Components.message]: asValue('world'),
        [Components.helloController]: asClass(HelloController).scoped(),
        [Components.createRoutes]:
            asFunction<RoutesFactory>(createRoutes).singleton(),
        [Components.createApp]: asFunction<AppFactory>(createApp).singleton(),
    })

    return container
}
