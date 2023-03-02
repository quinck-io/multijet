import { FastifyReply } from 'fastify'
import { RouteGenericInterface } from 'fastify/types/route'
import { ServiceError } from '../../errors/errors'
import { UNKNOWN_ERROR } from './fastify-controller.consts'
import { TryDoHandler } from './fastify-controller.models'

/**
 * A basic controller for the fastify framework.
 * A controller used for the fastify framework should extend this one.
 * Provides some utilities and an error management integrated with ServiceError errors.
 */
export abstract class FastifyController<ErrorResponse> {
    private readonly name: string

    constructor(name: string) {
        this.name = name
    }

    /**
     * Encapsulate the error management for an handler of a controller that extends this class.
     * @param fun the controller handler
     * @returns the result to be sent back to the client, an ErrorResponse otherwise
     */
    protected tryDo<
        RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    >(
        fun: TryDoHandler<ErrorResponse, RouteGeneric>,
    ): TryDoHandler<ErrorResponse, RouteGeneric> {
        return async (req, res) => {
            try {
                return await fun(req, res)
            } catch (error: unknown) {
                return this.handleError(res, error)
            }
        }
    }

    private handleError(res: FastifyReply, error: unknown): ErrorResponse {
        if (
            error == undefined ||
            error == null ||
            !(error instanceof ServiceError)
        ) {
            res.statusCode = 500
            return this.errorToErrorResponse(error)
        }
        return this.handleServiceError(res, error)
    }

    protected handleServiceError(
        res: FastifyReply,
        error: ServiceError,
    ): ErrorResponse {
        if (error.error) {
            res.log.error(this.formatErrorMessage('service error'))
            res.log.error(this.formatErrorMessage(error.error.message))
        }
        res.statusCode = error.code
        return this.serviceErrorToErrorResponse(error)
    }

    protected abstract errorToErrorResponse(error?: unknown): ErrorResponse

    protected abstract serviceErrorToErrorResponse(
        error: ServiceError,
    ): ErrorResponse

    protected parseError(error: unknown): Error {
        if (error) {
            if (error instanceof Error) return error
            else if (typeof error === 'string') return new Error(error)
        }
        return new Error(UNKNOWN_ERROR)
    }

    private formatErrorMessage(message: string): string {
        return `[${this.name}] ${message}`
    }
}
