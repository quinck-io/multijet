import { ErrorIdentifier } from '@libs/errors'
import { ErrorCode } from '@libs/fastify-utils'

/**
 * Encapsulate the logic of maintaing mappings between
 * errors and the information they should provide in api response.
 */
export interface ApiErrorsInformationLookupService {
    /**
     * Add new mappings or replaces existing ones where the identifiers matches.
     * @param mappings the new mapping to be set
     */
    putMappings(mappings: ApiErrorInformationMappings): void
    /**
     * Retrieve the parser for a specified identifier.
     * @param identifier the error identifier
     * @returns the parser to be used to retrieve error information from a given error
     */
    getParser(identifier: ErrorIdentifier): ApiErrorInformationParser
    /**
     * Verify if there is a mapping for the given identifier.
     * @param identifier the error identifier
     * @returns true if there is a mapping for the given identifier, false otherwise
     */
    hasMapping(identifier: ErrorIdentifier): boolean
}

export type ApiErrorInformation = {
    errorCode: ErrorCode
    status: number
}

export type ApiErrorInformationParser = (error: Error) => ApiErrorInformation

export type ApiErrorInformationMappings = Record<
    ErrorIdentifier,
    ApiErrorInformationParser
>
