import { Optional, RecursiveKeyOf } from '@libs/utils'
import { FastifyError, FastifyRequest, ValidationResult } from 'fastify'
import rawInputs from './inputs.json'

export type FastifyValidationResult = ValidationResult & {
    instancePath?: string
}

export type ValidationContext = 'body' | 'params' | 'query'

export type FastifyValidationErrorWithMissingProps = FastifyError & {
    validationContext: ValidationContext
    validation: FastifyValidationResult[]
}

const inputs = rawInputs as unknown as Record<
    string,
    Record<string, Record<string, Record<string, string>>>
>

export function getInputId(
    request: FastifyRequest,
    validationError: FastifyValidationErrorWithMissingProps,
): string | undefined {
    const { validation, validationContext } = validationError
    const [{ instancePath, schemaPath }] = validation
    const data = instancePath || schemaPath || ''

    return getInputIdIfExists(request, validationContext, data)
}

export function getInputIdGeneric<T extends object>(
    request: FastifyRequest,
    context: ValidationContext,
    prop: RecursiveKeyOf<T>,
): Optional<string> {
    const data = `/${prop.split('.').join('/')}` //improve code with constants
    return getInputIdIfExists(request, context, data)
}

function getInputIdIfExists(
    request: FastifyRequest,
    context: ValidationContext,
    data: string,
): Optional<string> {
    const { method, url } = request
    if (
        url in inputs &&
        method in inputs[url] &&
        context in inputs[url][method] &&
        data in inputs[url][method][context]
    )
        return inputs[url][method][context][data]
    return undefined
}
