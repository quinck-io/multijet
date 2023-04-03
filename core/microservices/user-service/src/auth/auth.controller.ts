import {
    ConfirmSignupByCode,
    formatUserToken,
    Handlers,
    Login,
    userIdFromToken,
} from '@libs/fastify-utils'
import {
    AdminUserManager,
    AuthManager,
    ForceChangePasswordException,
    UserManager,
    WrongUsernameOrPasswordError,
} from '@libs/user-manager'
import { StatusCodes } from 'http-status-codes'
import {
    ForceChangePasswordError,
    WrongEmailOrPasswordError,
} from './auth.errors'
import { AuthManagerLogin } from './auth.models'

export class AuthController {
    constructor(
        private readonly authManager: AuthManager,
        private readonly adminManager: AdminUserManager,
        private readonly userManager: UserManager,
    ) {}

    public login: Handlers['login'] = async request => {
        return this.handleUserManagerOperation(async () => {
            const { email, password } = request.body
            const { idToken, refreshToken } = await this.authManager.login({
                username: email,
                password,
            })
            return {
                authorization: idToken,
                refresh: refreshToken,
                userId: userIdFromToken(idToken),
            }
        })
    }

    public completeForceChangePasswordChallenge: Handlers['completeForceChangePasswordChallenge'] =
        async request => {
            return this.handleUserManagerOperation(async () => {
                const { email, newPassword, temporaryPassword } = request.body
                const tokens = await this.authManager.login(
                    {
                        username: email,
                        password: temporaryPassword,
                    },
                    { forceChangePassword: { password: newPassword } },
                )
                const userId = userIdFromToken(tokens.idToken)
                await this.adminManager.forceEmailVerification(userId)

                return this.formatLogin(tokens)
            })
        }

    public resetPassword: Handlers['resetPassword'] = async (
        request,
        reply,
    ) => {
        const { email, newPassword, temporaryPassword } = request.body
        this.authManager.resetPassword({
            username: email,
            confirmationCode: temporaryPassword,
            newPassword,
        })

        reply.statusCode = StatusCodes.NO_CONTENT
        return null
    }

    public resendSignupConfirmation: Handlers['resendSignupConfirmation'] =
        async (request, reply) => {
            const { email } = request.body
            if (email)
                await this.authManager.resendConfirmationLinkByEmail(email)

            reply.statusCode = StatusCodes.NO_CONTENT
            return null
        }

    public updateUserCredentials: Handlers['updateUserCredentials'] = async (
        request,
        reply,
    ) => {
        const { authorization, refreshToken } = formatUserToken(request.headers)
        const { newPassword, oldPassword } = request.body
        //TODO implements this using the admin user manager to avoid using accessToken
        await this.authManager.updateCredentials(
            {
                newPassword,
                oldPassword,
            },
            {
                accessToken: '',
                idToken: authorization,
                refreshToken,
            },
        )

        reply.statusCode = StatusCodes.NO_CONTENT
        return null
    }

    private async confirmByCode(
        userId: string,
        { code }: ConfirmSignupByCode,
    ): Promise<void> {
        return this.userManager.confirmSignUp(userId, code)
    }

    private async handleUserManagerOperation<X>(
        fun: () => Promise<X>,
    ): Promise<X> {
        try {
            return await fun()
        } catch (error) {
            if (error instanceof ForceChangePasswordException)
                throw new ForceChangePasswordError()
            if (error instanceof WrongUsernameOrPasswordError)
                throw new WrongEmailOrPasswordError()
            throw error
        }
    }

    private formatLogin({ idToken, refreshToken }: AuthManagerLogin): Login {
        return {
            authorization: idToken,
            refresh: refreshToken,
            userId: userIdFromToken(idToken),
        }
    }
}
