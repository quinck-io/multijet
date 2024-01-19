import { ValidationError } from "@libs/models"
import { isPresent } from "@libs/utils"
import { FastifyError } from "fastify"

export type FastifyValidationError = FastifyError &
    Required<Pick<FastifyError, "validation" | "validationContext">>

export const isFastifyValidationError = (
    error: Error,
): error is FastifyValidationError =>
    isPresent((error as FastifyError).validation) &&
    isPresent((error as FastifyError).validationContext)

export const getInputId = (validationError: FastifyValidationError) => {
    const { validation, validationContext } = validationError
    const [{ instancePath, schemaPath }] = validation
    const data = instancePath || schemaPath || ""

    return `${validationContext}/${data.split(".").join("/")}`
}

export const getValidationErrors = (
    validationError: FastifyValidationError,
): ValidationError[] => {
    const { validation, validationContext } = validationError

    return validation.map(validationError => ({
        field: validationError.instancePath,
        message: validationError.message ?? "",
        additionalData: {
            ...validationError,
            validationContext,
        },
    }))
}
