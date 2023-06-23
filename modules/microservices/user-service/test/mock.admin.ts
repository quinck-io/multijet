import {
    AdminUserManager,
    UserAttribute,
    UserUpdateAttribute,
} from '@libs/user-manager'
import {
    AdminCreateUserCredentials,
    CompleteUserInfo,
    SearchUsersParameters,
} from '@quinck/aws-cognito-client'
import { DUMMY_USER_REPLY } from './mock.user'
import { BasicMockService } from './utils/mock'

export const DUMMY_NEW_USER = {
    email: 'prova@prova.com',
}

export const DUMMY_WRONG_NEW_USER = {
    email: 'prova@prova.com',
}

export class DummyAdminUserManager
    extends BasicMockService
    implements AdminUserManager
{
    createUser(
        credentials: AdminCreateUserCredentials,
        user: UserAttribute,
        groups?: string[] | undefined,
    ): Promise<void> {
        return this.throwErrorOrReturn(new Promise(resolve => resolve()))
    }
    getUser(username: string): Promise<CompleteUserInfo<UserAttribute>> {
        return this.throwErrorOrReturn(
            Promise.resolve<CompleteUserInfo<UserAttribute>>({
                email: DUMMY_USER_REPLY.email,
                id: DUMMY_USER_REPLY.userId,
            }),
        )
    }
    getUserGroups(username: string): Promise<string[]> {
        throw new Error('Method not implemented.')
    }
    updateUser(username: string, user: UserUpdateAttribute): Promise<void> {
        throw new Error('Method not implemented.')
    }
    deleteUser(username: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
    addUserToGroup(username: string, group: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
    removeUserFromGroup(username: string, group: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
    disableUser(username: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
    enableUser(username: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
    getAllUsers(): Promise<CompleteUserInfo<UserAttribute>[]> {
        throw new Error('Method not implemented.')
    }
    searchUsers(
        params: SearchUsersParameters,
    ): Promise<CompleteUserInfo<UserAttribute>[]> {
        throw new Error('Method not implemented.')
    }
    searchUsersInGroup(
        group: string,
        params: SearchUsersParameters,
    ): Promise<CompleteUserInfo<UserAttribute>[]> {
        throw new Error('Method not implemented.')
    }
    getUserByEmail(email: string): Promise<CompleteUserInfo<UserAttribute>> {
        throw new Error('Method not implemented.')
    }
    forceEmailVerification(username: string): Promise<void> {
        return this.throwErrorOrReturn(new Promise(resolve => resolve()))
    }
    forcePhoneNumberVerification(username: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
