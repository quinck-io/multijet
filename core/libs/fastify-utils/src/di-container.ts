import { apiErrorsInformationLookupService } from '@libs/api-errors'
import { AwilixContainer, asFunction, createContainer } from 'awilix'
import {
    ErrorHandlerParams,
    apiErrorHandler,
} from './errors/api-error-handler/api-error-handler'
import { AppFactory, AppParams, defaultApp } from './fastify/app/app'

export type FastifyUtilsComponents = ErrorHandlerParams &
    AppParams & {
        defaultApp: AppFactory
    }

export const fastifyUtilsContainer =
    (): AwilixContainer<FastifyUtilsComponents> => {
        const container = createContainer<FastifyUtilsComponents>()

        container.register({
            apiErrorHandler: asFunction(apiErrorHandler).singleton(),
            apiErrorsInformationLookupService: asFunction(
                apiErrorsInformationLookupService,
            ).singleton(),
            defaultApp: asFunction(defaultApp).singleton(),
        })

        return container
    }
