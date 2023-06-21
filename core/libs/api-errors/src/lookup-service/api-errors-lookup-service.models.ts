import { ErrorIdentifier } from '@libs/errors'
import { ErrorCode } from '@libs/models'
import { StatusCodes } from 'http-status-codes'

/**
 * Encapsulate the logic of maintaing mappings between
 * errors and the information they should provide in api response.
 */
export interface ApiErrorsLookupService {
    /**
     * Add new mappings or replaces existing ones where the identifiers matches.
     * @param mappings the new mapping to be set
     */
    putMappings(mappings: ApiErrorMappings): void
    /**
     * Retrieve the parser for a specified identifier.
     * @param identifier the error identifier
     * @returns the parser to be used to retrieve error information from a given error
     */
    getParser(identifier: ErrorIdentifier): ApiErrorParser
    /**
     * Verify if there is a mapping for the given identifier.
     * @param identifier the error identifier
     * @returns true if there is a mapping for the given identifier, false otherwise
     */
    hasMapping(identifier: ErrorIdentifier): boolean
}

export type ApiError = {
    errorCode: ErrorCode
    status: StatusCodes
}

export type ApiErrorParser = (error: Error) => ApiError

export type ApiErrorMappings = Record<ErrorIdentifier, ApiErrorParser>
