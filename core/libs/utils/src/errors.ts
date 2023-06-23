import { isPresent } from './checks'

export class BasicError extends Error {
    name = BasicError.name

    constructor(error?: unknown) {
        super(BasicError.formatMessage(error))
    }

    static formatMessage(error?: unknown): string {
        if (!isPresent(error)) return ''
        if (error instanceof Error) return `[${error.name}] ${error.message}`
        switch (typeof error) {
            case 'bigint':
            case 'number':
            case 'boolean':
                return String(error)
            case 'string':
                return error
            case 'object':
            case 'function':
                return error ? error.toString() : ''
            default:
                return ''
        }
    }
}
