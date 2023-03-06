import {
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault,
    RouteHandlerMethod,
} from 'fastify'
import { RouteGenericInterface } from 'fastify/types/route'

export type SimpleHandler<
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
> = RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    RouteGeneric
>

export type TryDoHandler<
    ErrorResponse,
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    InnerHandler extends SimpleHandler<
        RouteGeneric & { Reply: RouteGeneric['Reply'] | ErrorResponse }
    > = SimpleHandler<
        RouteGeneric & { Reply: RouteGeneric['Reply'] | ErrorResponse }
    >,
> = (
    request: Parameters<InnerHandler>[0],
    reply: Parameters<InnerHandler>[1],
) => Promise<RouteGeneric['Reply'] | ErrorResponse>
