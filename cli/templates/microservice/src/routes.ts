import { RoutesHandlerMapping, getHelloWorldRouteConfig } from "@libs/http"
import { getHello } from "./hello/hello.controller"

export const createRoutes = (): RoutesHandlerMapping => [
    {
        config: getHelloWorldRouteConfig,
        handler: getHello,
    },
]
