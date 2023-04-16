import { ErrorIdentifier } from './error-identifier.types'

declare global {
    interface Error {
        /**
         * Retrieve the identifier of the error.
         * @returns the identifier of the array
         */
        readonly identifier: ErrorIdentifier
    }
}

Object.defineProperty(Array.prototype, 'identifier', {
    get: function (): ErrorIdentifier {
        const _self = this as Error
        return _self.name
    },
})
