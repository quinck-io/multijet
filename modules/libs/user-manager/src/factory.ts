import {
    createAdminUserService,
    createAuthService,
    createUserService,
} from '@quinck/aws-cognito-client'
import {
    AdminUserManager,
    AuthManager,
    UserManager,
    userStructure,
} from './user/user.models'

export function createAdminManager(userPoolId: string): AdminUserManager {
    return createAdminUserService({
        type: 'cognito',
        userPoolId,
        userStructure,
    })
}

export function createAuthManager(
    userPoolId: string,
    clientId: string,
): AuthManager {
    return createAuthService({
        type: 'cognito',
        userPoolId,
        clientId,
        userStructure,
    })
}

export function createUserManager(
    userPoolId: string,
    clientId: string,
): UserManager {
    return createUserService({
        type: 'cognito',
        userPoolId,
        clientId,
        userStructure,
    })
}
