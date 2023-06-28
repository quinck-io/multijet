import { StatusCodes } from 'http-status-codes'

export const httpErrorsRfcType = (status: StatusCodes): string => {
    switch (status) {
        case StatusCodes.CONTINUE:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.2.1'
        case StatusCodes.SWITCHING_PROTOCOLS:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.2.2'
        case StatusCodes.PROCESSING:
            return 'https://datatracker.ietf.org/doc/html/rfc2518#section-10.1'
        case StatusCodes.OK:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.3.1'
        case StatusCodes.CREATED:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.3.2'
        case StatusCodes.ACCEPTED:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.3.3'
        case StatusCodes.NON_AUTHORITATIVE_INFORMATION:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.3.4'
        case StatusCodes.NO_CONTENT:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.3.5'
        case StatusCodes.RESET_CONTENT:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.3.6'
        case StatusCodes.PARTIAL_CONTENT:
            return 'https://datatracker.ietf.org/doc/html/rfc7233#section-4.1'
        case StatusCodes.MULTI_STATUS:
            return 'https://datatracker.ietf.org/doc/html/rfc4918#section-13'
        // case StatusCodes.ALREADY_REPORTED:
        //     return 'https://datatracker.ietf.org/doc/html/rfc5842#section-7.1'
        // case StatusCodes.IM_USED:
        //     return 'https://datatracker.ietf.org/doc/html/rfc3229#section-10.4.1'
        case StatusCodes.MULTIPLE_CHOICES:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.4.1'
        case StatusCodes.MOVED_PERMANENTLY:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.4.2'
        // case StatusCodes.FOUND:
        //     return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.4.3'
        case StatusCodes.SEE_OTHER:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.4.4'
        case StatusCodes.NOT_MODIFIED:
            return 'https://datatracker.ietf.org/doc/html/rfc7232#section-4.1'
        case StatusCodes.USE_PROXY:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.4.5'
        case StatusCodes.TEMPORARY_REDIRECT:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.4.7'
        case StatusCodes.PERMANENT_REDIRECT:
            return 'https://datatracker.ietf.org/doc/html/rfc7538#section-3'
        case StatusCodes.BAD_REQUEST:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1'
        case StatusCodes.UNAUTHORIZED:
            return 'https://datatracker.ietf.org/doc/html/rfc7235#section-3.1'
        case StatusCodes.PAYMENT_REQUIRED:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.2'
        case StatusCodes.FORBIDDEN:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.3'
        case StatusCodes.NOT_FOUND:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4'
        case StatusCodes.METHOD_NOT_ALLOWED:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.5'
        case StatusCodes.NOT_ACCEPTABLE:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.6'
        case StatusCodes.PROXY_AUTHENTICATION_REQUIRED:
            return 'https://datatracker.ietf.org/doc/html/rfc7235#section-3.2'
        case StatusCodes.REQUEST_TIMEOUT:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.7'
        case StatusCodes.CONFLICT:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.8'
        case StatusCodes.GONE:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.9'
        case StatusCodes.LENGTH_REQUIRED:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.10'
        case StatusCodes.PRECONDITION_FAILED:
            return 'https://datatracker.ietf.org/doc/html/rfc7232#section-4.2'
        // case StatusCodes.PAYLOAD_TOO_LARGE:
        //     return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.11'
        // case StatusCodes.URI_TOO_LONG:
        //     return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.12'
        case StatusCodes.UNSUPPORTED_MEDIA_TYPE:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.13'
        // case StatusCodes.RANGE_NOT_SATISFIABLE:
        //     return 'https://datatracker.ietf.org/doc/html/rfc7233#section-4.4'
        case StatusCodes.EXPECTATION_FAILED:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.14'
        case StatusCodes.MISDIRECTED_REQUEST:
            return 'https://datatracker.ietf.org/doc/html/rfc7540#section-9.1.2'
        case StatusCodes.UNPROCESSABLE_ENTITY:
            return 'https://datatracker.ietf.org/doc/html/rfc4918#section-11.2'
        case StatusCodes.LOCKED:
            return 'https://datatracker.ietf.org/doc/html/rfc4918#section-11.3'
        case StatusCodes.FAILED_DEPENDENCY:
            return 'https://datatracker.ietf.org/doc/html/rfc4918#section-11.4'
        // case StatusCodes.UPGRADE_REQUIRED:
        //     return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.15'
        case StatusCodes.PRECONDITION_REQUIRED:
            return 'https://datatracker.ietf.org/doc/html/rfc6585#section-3'
        case StatusCodes.TOO_MANY_REQUESTS:
            return 'https://datatracker.ietf.org/doc/html/rfc6585#section-4'
        case StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE:
            return 'https://datatracker.ietf.org/doc/html/rfc6585#section-5'
        case StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS:
            return 'https://datatracker.ietf.org/doc/html/rfc7725#section-3'
        case StatusCodes.INTERNAL_SERVER_ERROR:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1'
        case StatusCodes.NOT_IMPLEMENTED:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.2'
        case StatusCodes.BAD_GATEWAY:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.3'
        case StatusCodes.SERVICE_UNAVAILABLE:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.4'
        case StatusCodes.GATEWAY_TIMEOUT:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.5'
        case StatusCodes.HTTP_VERSION_NOT_SUPPORTED:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.6'
        // case StatusCodes.VARIANT_ALSO_NEGOTIATES:
        //     return 'https://datatracker.ietf.org/doc/html/rfc2295#section-8.1'
        case StatusCodes.INSUFFICIENT_STORAGE:
            return 'https://datatracker.ietf.org/doc/html/rfc4918#section-11.5'
        // case StatusCodes.LOOP_DETECTED:
        //     return 'https://datatracker.ietf.org/doc/html/rfc5842#section-7.2'
        // case StatusCodes.NOT_EXTENDED:
        //     return 'https://datatracker.ietf.org/doc/html/rfc2774#section-7'
        case StatusCodes.NETWORK_AUTHENTICATION_REQUIRED:
            return 'https://datatracker.ietf.org/doc/html/rfc6585#section-6'
        case StatusCodes.IM_A_TEAPOT:
            return 'https://datatracker.ietf.org/doc/html/rfc2324#section-2.3.2'
        case StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE:
            return 'https://datatracker.ietf.org/doc/html/rfc2518#section-10.6'
        case StatusCodes.MOVED_TEMPORARILY:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.4.2'
        case StatusCodes.REQUESTED_RANGE_NOT_SATISFIABLE:
            return 'https://datatracker.ietf.org/doc/html/rfc7233#section-4.4'
        case StatusCodes.REQUEST_TOO_LONG:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.11'
        case StatusCodes.REQUEST_URI_TOO_LONG:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.12'
        // case StatusCodes.METHOD_FAILURE:
        //     return 'https://datatracker.ietf.org/doc/html/rfc4918#section-11.2'
        default:
            return 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.1'
    }
}
