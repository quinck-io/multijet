import {
    RoutesHandlerMapping,
    completeForceChangePasswordChallengeRouteConfig,
    createUserRouteConfig,
    getUserProfileRouteConfig,
    getUsersRouteConfig,
    loginRouteConfig,
    resendSignupConfirmationRouteConfig,
    resetPasswordRouteConfig,
    updateUserCredentialsRouteConfig,
    updateUserProfileRouteConfig,
} from '@libs/fastify-utils'
import { createUser, getUsers } from './admin/admin.controller'
import {
    completeForceChangePasswordChallenge,
    login,
    resendSignupConfirmation,
    resetPassword,
    updateUserCredentials,
} from './auth/auth.controller'
import { getUserProfile, updateUserProfile } from './profile/profile.controller'

export const createRoutes = (): RoutesHandlerMapping => [
    {
        config: completeForceChangePasswordChallengeRouteConfig,
        handler: completeForceChangePasswordChallenge,
    },
    { config: createUserRouteConfig, handler: createUser },
    {
        config: getUserProfileRouteConfig,
        handler: getUserProfile,
    },
    { config: getUsersRouteConfig, handler: getUsers },
    { config: loginRouteConfig, handler: login },
    {
        config: resendSignupConfirmationRouteConfig,
        handler: resendSignupConfirmation,
    },
    { config: resetPasswordRouteConfig, handler: resetPassword },
    {
        config: updateUserCredentialsRouteConfig,
        handler: updateUserCredentials,
    },
    {
        config: updateUserProfileRouteConfig,
        handler: updateUserProfile,
    },
]
