import {
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    RouteOptions,
} from "fastify"
import { AppCorsOptions } from "./cors.app"

type GenericRouteOptions = RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
        Body: any
        Querystring: any
        Params: any
        Headers: any
        Reply: any
    }
>

export type RoutesHandlerMapping = Array<{
    config: Omit<GenericRouteOptions, "handler">
    handler: GenericRouteOptions["handler"]
}>

export type ApplicationOptions = {
    cors?: AppCorsOptions
    healthCheck?: HealthCheck
}

export type HealthCheck = {
    path: string
}
