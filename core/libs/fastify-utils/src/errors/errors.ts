import { ErrorData, ErrorCode } from '../generated/openapi'
import { StatusCodes } from 'http-status-codes'

export class ServiceError extends Error {
    constructor(
        public readonly code: StatusCodes,
        public readonly name: ErrorCode,
        public readonly error?: Error,
        public readonly inputId?: string,
    ) {
        super('')
        if (error) {
            this.message = `[${error.name}] ${error.message}`
        }
    }

    public toErrorReponse(): ErrorData {
        return {
            errorCode: this.name,
            description: this.message,
            inputId: this.inputId,
        }
    }
}