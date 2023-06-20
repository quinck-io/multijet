import {
    RoutesHandlerMapping,
    completeForceChangePasswordChallengeRoute,
    createUserRoute,
    getUserProfileRoute,
    getUsersRoute,
    loginRoute,
    resendSignupConfirmationRoute,
    resetPasswordRoute,
    updateUserCredentialsRoute,
    updateUserProfileRoute,
} from '@libs/fastify-utils'
import { AdminController } from './admin/admin.controller'
import { AuthController } from './auth/auth.controller'
import { ProfileController } from './profile/profile.controller'
import { AppComponents } from './utils/components'

export function createRoutes(components: AppComponents): RoutesHandlerMapping {
    const { adminManager, authManager, userManager } = components
    const adminController = new AdminController(adminManager)
    const authController = new AuthController(
        authManager,
        adminManager,
        userManager,
    )
    const profileController = new ProfileController(adminManager, userManager)

    return [
        {
            config: completeForceChangePasswordChallengeRoute,
            handler: authController.completeForceChangePasswordChallenge,
        },
        { config: createUserRoute, handler: adminController.createUser },
        {
            config: getUserProfileRoute,
            handler: profileController.getUserProfile,
        },
        { config: getUsersRoute, handler: adminController.getUsers },
        { config: loginRoute, handler: authController.login },
        {
            config: resendSignupConfirmationRoute,
            handler: authController.resendSignupConfirmation,
        },
        { config: resetPasswordRoute, handler: authController.resetPassword },
        {
            config: updateUserCredentialsRoute,
            handler: authController.updateUserCredentials,
        },
        {
            config: updateUserProfileRoute,
            handler: profileController.updateUserProfile,
        },
    ]
}
