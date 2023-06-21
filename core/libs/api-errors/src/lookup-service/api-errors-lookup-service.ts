import { defualtApiErrorParser } from './api-errors-lookup-service.consts'
import {
    ApiErrorMappings,
    ApiErrorsLookupService,
} from './api-errors-lookup-service.models'

/**
 * Factory to create a ApiErrorsLookupService.
 * @returns an ApiErrorsLookupService
 */
export const createApiErrorsLookupService = (): ApiErrorsLookupService => {
    const mappings: ApiErrorMappings = {}

    return {
        hasMapping: identifier => identifier in mappings,
        getParser: identifier => mappings[identifier] ?? defualtApiErrorParser,
        putMappings: newMappings => Object.assign(mappings, newMappings),
    }
}
