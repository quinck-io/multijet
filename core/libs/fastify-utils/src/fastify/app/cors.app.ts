import fastifyCors, { FastifyCorsOptions } from '@fastify/cors'
import { FastifyInstance } from 'fastify'

export type AppCorsOptions = FastifyCorsOptions | boolean | undefined

export const DEFAULT_CORS_OPTIONS: FastifyCorsOptions = {
    origin: true,
    allowedHeaders: '*',
    credentials: true,
    methods: ['POST', 'PUT', 'DELETE', 'GET', 'OPTIONS', 'PATCH'],
    strictPreflight: false,
}

export function decorateAppWithCors(
    app: FastifyInstance,
    opt?: AppCorsOptions,
): FastifyInstance {
    if (opt === false || opt === undefined) return app
    if (opt === true) return app.register(fastifyCors, DEFAULT_CORS_OPTIONS)
    return app.register(fastifyCors, opt)
}
