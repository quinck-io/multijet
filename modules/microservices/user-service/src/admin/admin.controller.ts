import { Handlers } from '@libs/fastify-utils'
import { User } from '@libs/models'
import { StatusCodes } from 'http-status-codes'

export const createUser: Handlers['createUser'] = async (request, reply) => {
    const { adminManager } = request.services

    const { email } = request.body

    await adminManager.createUser({ username: email }, { email })

    reply.statusCode = StatusCodes.NO_CONTENT
}

export const getUsers: Handlers['getUsers'] = async request => {
    const { adminManager } = request.services

    const users = await adminManager.searchUsers({})

    return {
        numberOfItems: users.length,
        items: users.map<User>(({ email, id }) => ({
            email,
            userId: id,
        })),
    }
}
