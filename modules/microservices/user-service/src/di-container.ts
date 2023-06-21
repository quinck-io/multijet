import {
    AdminUserManager,
    AuthManager,
    UserManager,
    createAdminManager,
    createAuthManager,
    createUserManager,
} from '@libs/user-manager'
import { getEnvironment } from '@libs/utils'
import { AwilixContainer, asFunction, createContainer } from 'awilix'
import { JoiEnvironmentValidationSchema } from './utils/env'

declare module 'fastify' {
    interface FastifyRequest {
        services: AppServices
    }
}

export type AppServices = {
    adminManager: AdminUserManager
    authManager: AuthManager
    userManager: UserManager
}

export function appContainer(): AwilixContainer<AppServices> {
    const container = createContainer<AppServices>()

    const env = getEnvironment(JoiEnvironmentValidationSchema)
    const userPoolId = env.USER_POOL_ID
    const userClientId = env.USER_CLIENT_ID

    container.register({
        adminManager: asFunction(() => createAdminManager(userPoolId)).scoped(),
        authManager: asFunction(() =>
            createAuthManager(userPoolId, userClientId),
        ).scoped(),
        userManager: asFunction(() =>
            createUserManager(userPoolId, userClientId),
        ).scoped(),
    })

    return container
}
