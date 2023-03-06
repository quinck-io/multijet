import {
    BasicUserInfo,
    Credentials,
    UserAuthToken,
    UserInfo,
} from '@quinck/aws-cognito-client'
import {
    UserAttribute,
    UserManager,
    UserUpdateAttribute,
} from '../../../libs/user-manager'
import { BasicMockService } from './utils/mock'

export const DUMMY_USER_INFO = {
    email: 'prova@prova.com',
    id: 'id1',
}
export const DUMMY_USER_REPLY = {
    email: 'prova@prova.com',
    userId: 'id1',
}

export class DummyUserManager extends BasicMockService implements UserManager {
    signUp(
        credentials: Credentials,
        data: UserAttribute,
    ): Promise<BasicUserInfo> {
        return this.throwErrorOrReturn(Promise.resolve({ id: 'try' }))
    }
    confirmSignUp(username: string, code: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
    getUserInfo(token: UserAuthToken): Promise<UserInfo<UserAttribute>> {
        return this.throwErrorOrReturn(Promise.resolve(DUMMY_USER_INFO))
    }
    updateUserInfo(
        token: UserAuthToken,
        user: UserUpdateAttribute,
    ): Promise<void> {
        throw new Error('Method not implemented.')
    }
    deleteUser(token: UserAuthToken): Promise<void> {
        throw new Error('Method not implemented.')
    }
}
