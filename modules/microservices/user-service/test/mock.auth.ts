import {
    AuthService,
    CompletedCustomAuthChallengeResponse,
    Credentials,
    CustomAuthChallengeResponse,
    LoginAdditionalData,
    RefreshAuthToken,
    ResetPasswordData,
    UpdateCredentialsInfo,
    UserToken,
} from '@quinck/aws-cognito-client'
import {
    BasicMockService,
    mockIdToken,
    mockRefreshToken,
    mockWrongHeaders,
} from './utils/mock'

export const DUMMY_EMAIL = 'prova@prova.com'
export const DUMMY_CONFIRM_CODE = '12345'

export const DUMMY_USER_PAYLOAD = {
    email: DUMMY_EMAIL,
    password: 'password123',
}

export const DUMMY_FIRST_LOGIN_PAYLOAD = {
    email: DUMMY_EMAIL,
    temporaryPassword: 'password123',
    newPassword: 'password987',
}

export const DUMMY_RESET_PASSWORD_PAYLOAD = {
    email: DUMMY_EMAIL,
    temporaryPassword: DUMMY_CONFIRM_CODE,
    newPassword: 'password987',
}

export class DummyAuthManager extends BasicMockService implements AuthService {
    login(
        userData: Credentials,
        additionalData?: LoginAdditionalData | undefined,
    ): Promise<UserToken> {
        if (userData.password != DUMMY_USER_PAYLOAD.password) throw new Error()
        return this.throwErrorOrReturn(
            Promise.resolve({
                accessToken: 'mockAccessToken',
                idToken: mockIdToken,
                refreshToken: mockRefreshToken,
            }),
        )
    }
    refresh(token: RefreshAuthToken): Promise<UserToken> {
        if (token.refreshToken === mockWrongHeaders['refresh-token'])
            throw new Error()
        return this.throwErrorOrReturn(
            Promise.resolve({
                accessToken: 'mockAccessToken',
                idToken: mockIdToken,
                refreshToken: mockRefreshToken,
            }),
        )
    }
    logout(token: UserToken): Promise<void> {
        throw new Error('Method not implemented.')
    }
    updateCredentials(
        updateInfo: UpdateCredentialsInfo,
        token: UserToken,
    ): Promise<void> {
        throw new Error('Method not implemented.')
    }
    resendConfirmationLinkByEmail(username: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
    forgotPassword(username: string): Promise<void> {
        return this.throwErrorOrReturn(new Promise(resolve => resolve()))
    }
    resetPassword(data: ResetPasswordData): Promise<void> {
        if (data.confirmationCode != DUMMY_CONFIRM_CODE) throw new Error()
        return this.throwErrorOrReturn(new Promise(resolve => resolve()))
    }
    initCustomAuthChallenge(
        username: string,
    ): Promise<CustomAuthChallengeResponse> {
        throw new Error('Method not implemented.')
    }
    verifyCustomAuthChallenge(
        username: string,
        challengeResponse: string,
        session: string,
    ): Promise<CompletedCustomAuthChallengeResponse> {
        throw new Error('Method not implemented.')
    }
}
