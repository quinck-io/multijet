import { formatUserToken, Handlers, userIdFromToken } from '@libs/fastify-utils'
import { Login } from '@libs/models'
import {
    ForceChangePasswordException,
    WrongUsernameOrPasswordError,
} from '@libs/user-manager'
import { StatusCodes } from 'http-status-codes'
import {
    ForceChangePasswordError,
    WrongEmailOrPasswordError,
} from './auth.errors'
import { AuthManagerLogin } from './auth.models'

export const login: Handlers['login'] = async request => {
    const { authManager } = request.services
    return handleUserManagerOperation(async () => {
        const { email, password } = request.body
        const { idToken, refreshToken } = await authManager.login({
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

export const completeForceChangePasswordChallenge: Handlers['completeForceChangePasswordChallenge'] =
    async request => {
        const { authManager, adminManager } = request.services
        return handleUserManagerOperation(async () => {
            const { email, newPassword, temporaryPassword } = request.body
            const tokens = await authManager.login(
                {
                    username: email,
                    password: temporaryPassword,
                },
                { forceChangePassword: { password: newPassword } },
            )
            const userId = userIdFromToken(tokens.idToken)
            await adminManager.forceEmailVerification(userId)

            return formatLogin(tokens)
        })
    }

export const resetPassword: Handlers['resetPassword'] = async (
    request,
    reply,
) => {
    const { authManager } = request.services
    const { email, newPassword, temporaryPassword } = request.body
    authManager.resetPassword({
        username: email,
        confirmationCode: temporaryPassword,
        newPassword,
    })

    reply.statusCode = StatusCodes.NO_CONTENT
}

export const resendSignupConfirmation: Handlers['resendSignupConfirmation'] =
    async (request, reply) => {
        const { authManager } = request.services
        const { email } = request.body
        if (email) await authManager.resendConfirmationLinkByEmail(email)

        reply.statusCode = StatusCodes.NO_CONTENT
    }

export const updateUserCredentials: Handlers['updateUserCredentials'] = async (
    request,
    reply,
) => {
    const { authManager } = request.services
    const { authorization, refreshToken } = formatUserToken(request.headers)
    const { newPassword, oldPassword } = request.body
    //TODO implements this using the admin user manager to avoid using accessToken
    await authManager.updateCredentials(
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
}

export const handleUserManagerOperation = async <X>(
    fun: () => Promise<X>,
): Promise<X> => {
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

export const formatLogin = ({
    idToken,
    refreshToken,
}: AuthManagerLogin): Login => {
    return {
        authorization: idToken,
        refresh: refreshToken,
        userId: userIdFromToken(idToken),
    }
}
