import {
    AdminUserManager,
    AuthManager,
    createAdminManager,
    createAuthManager,
    createUserManager,
    UserManager,
} from '@libs/user-manager'
import { getEnvironment } from '@libs/utils'
import { JoiEnvironmentValidationSchema } from './env'

export interface AppComponents {
    adminManager: AdminUserManager
    authManager: AuthManager
    userManager: UserManager
}

export function createAppComponents(): AppComponents {
    const env = getEnvironment(JoiEnvironmentValidationSchema)
    const userPoolId = env.USER_POOL_ID
    const userClientId = env.USER_CLIENT_ID

    return {
        adminManager: createAdminManager(userPoolId),
        authManager: createAuthManager(userPoolId, userClientId),
        userManager: createUserManager(userPoolId, userClientId),
    }
}
