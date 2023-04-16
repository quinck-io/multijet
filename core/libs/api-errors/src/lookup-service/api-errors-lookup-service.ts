import { defualtApiErrorInformationParser } from './api-errors-lookup-service.consts'
import {
    ApiErrorInformationMappings,
    ApiErrorsInformationLookupService,
} from './api-errors-lookup-service.models'

/**
 * Factory to create a ApiErrorsInformationLookupService.
 * @returns an ApiErrorsInformationLookupService
 */
export const apiErrorsInformationLookupService =
    (): ApiErrorsInformationLookupService => {
        const mappings: ApiErrorInformationMappings = {}

        return {
            hasMapping: identifier => identifier in mappings,
            getParser: identifier =>
                mappings[identifier] ?? defualtApiErrorInformationParser,
            putMappings: newMappings => Object.assign(mappings, newMappings),
        }
    }
