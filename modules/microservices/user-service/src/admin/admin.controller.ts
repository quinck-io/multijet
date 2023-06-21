import { Handlers } from '@libs/fastify-utils'
import { User } from '@libs/models'
import { UserAlreadyExistsError } from '@libs/user-manager'
import { StatusCodes } from 'http-status-codes'
import { AccountAlreadyExistsError } from './admin.errors'

export const createUser: Handlers['createUser'] = async (request, reply) => {
    const { adminManager } = request.services
    return handleUserManagerOperation(async () => {
        const { email } = request.body

        await adminManager.createUser({ username: email }, { email })

        reply.statusCode = StatusCodes.NO_CONTENT
    })
}

export const getUsers: Handlers['getUsers'] = async request => {
    const { adminManager } = request.services

    return handleUserManagerOperation(async () => {
        const users = await adminManager.searchUsers({})

        return {
            numberOfItems: users.length,
            items: users.map<User>(({ email, id }) => ({
                email,
                userId: id,
            })),
        }
    })
}

const handleUserManagerOperation = async <X>(
    fun: () => Promise<X>,
): Promise<X> => {
    try {
        return await fun()
    } catch (error) {
        if (error instanceof UserAlreadyExistsError)
            throw new AccountAlreadyExistsError()
        throw error
    }
}
