import { RoutesHandlerMapping, getHelloWorldRoute } from '@libs/fastify-utils'
import { HelloController } from './hello/hello.controller'
import { AppComponents } from './utils/components'

export function createRoutes(components: AppComponents): RoutesHandlerMapping {
    const helloController = new HelloController(components.message)

    return [{ config: getHelloWorldRoute, handler: helloController.getHello }]
}
