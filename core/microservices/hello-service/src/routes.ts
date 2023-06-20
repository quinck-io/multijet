import {
    RoutesHandlerMapping,
    getHelloWorldRouteConfig,
} from '@libs/fastify-utils'
import { AppComponents } from './di-container'

export type RoutesFactory = () => RoutesHandlerMapping

export const createRoutes =
    ({ helloController }: AppComponents): RoutesFactory =>
    () =>
        [
            {
                config: getHelloWorldRouteConfig,
                handler: helloController.getHello,
            },
        ]
