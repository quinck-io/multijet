/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiErrorsLookupService } from "@libs/api-errors"
import { AwilixContainer } from "awilix"
import {
    FastifyServerOptions,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    RouteOptions,
} from "fastify"
import { AppCorsOptions } from "./cors.app"

declare module "fastify" {
    interface FastifyInstance {
        apiErrorsLookupService: ApiErrorsLookupService
    }
}

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
    diContainer?: AwilixContainer
    fastifyOptions?: FastifyServerOptions
}

export type HealthCheck = {
    path: string
}
