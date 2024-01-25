import {
    RoutesHandlerMapping,
    getHelloWorldRouteConfig,
} from "@libs/fastify-utils"
import { getHello } from "./hello/hello.controller"

export const createRoutes = (): RoutesHandlerMapping => [
    {
        config: getHelloWorldRouteConfig,
        handler: getHello,
    },
]
