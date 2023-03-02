import { AppCorsOptions } from './cors.app'

export type ApplicationOptions = {
    cors?: AppCorsOptions
    healthCheck?: HealthCheck
}

export type HealthCheck = {
    path: string
}
