import { isPresent } from '@libs/utils'
import { FastifyError } from 'fastify'

export type ValidationError = FastifyError &
    Required<Pick<FastifyError, 'validation' | 'validationContext'>>

export const isValidationError = (error: Error): error is ValidationError =>
    isPresent((error as FastifyError).validation) &&
    isPresent((error as FastifyError).validationContext)

export const getInputId = (validationError: ValidationError) => {
    const { validation, validationContext } = validationError
    const [{ instancePath, schemaPath }] = validation
    const data = instancePath || schemaPath || ''

    return `${validationContext}/${data.split('.').join('/')}`
}

export const getValidationErrors = (validationError: ValidationError) => {
    const { validation, validationContext } = validationError

    return validation.map(validationError => ({
        ...validationError,
        validationContext,
    }))
}
