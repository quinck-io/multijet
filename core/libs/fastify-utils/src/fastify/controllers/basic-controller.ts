import { ErrorData } from '@libs/models'
import { InternalServerError } from '../../errors/common'
import { ServiceError } from '../../errors/errors'
import { FastifyController } from './fastify-controller'

export class BasicController extends FastifyController<ErrorData> {
    protected errorToErrorResponse(error?: unknown): ErrorData {
        return this.serviceErrorToErrorResponse(
            new InternalServerError(this.parseError(error)),
        )
    }

    protected serviceErrorToErrorResponse(error: ServiceError): ErrorData {
        return error.toErrorReponse()
    }
}
