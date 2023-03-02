import { Handlers } from '@libs/fastify-utils/src'
import {
    AdminUserManager,
    AuthManager,
    createAdminManager,
    createAuthManager,
    createUserManager,
    UserManager,
} from '@libs/user-manager'
import { getEnvironment } from '@libs/utils'
import { AdminController } from '../admin/admin.controller'
import { AuthController } from '../auth/auth.controller'
import { ProfileController } from '../profile/profile.controller'
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

export function createHandlers(components: AppComponents): Handlers {
    const { adminManager, authManager, userManager } = components
    const adminController = new AdminController(adminManager)
    const authController = new AuthController(
        authManager,
        adminManager,
        userManager,
    )
    const profileController = new ProfileController(adminManager, userManager)

    return {
        completeForceChangePasswordChallenge:
            authController.completeForceChangePasswordChallenge,
        createUser: adminController.createUser,
        getUserProfile: profileController.getUserProfile,
        getUsers: adminController.getUsers,
        login: authController.login,
        resendSignupConfirmation: authController.resendSignupConfirmation,
        resetPassword: authController.resetPassword,
        updateUserCredentials: authController.updateUserCredentials,
        updateUserProfile: profileController.updateUserProfile,
    }
}
