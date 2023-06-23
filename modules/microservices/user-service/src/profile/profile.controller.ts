import { Handlers, userIdFromHeaders } from '@libs/fastify-utils'
import { StatusCodes } from 'http-status-codes'
import { parseUserProfile } from '../utils/users'

export const getUserProfile: Handlers['getUserProfile'] = async request => {
    const { adminManager } = request.services
    const userId = userIdFromHeaders(request.headers)
    const user = await adminManager.getUser(userId)
    return parseUserProfile(user)
}

export const updateUserProfile: Handlers['updateUserProfile'] = async (
    request,
    reply,
) => {
    const { adminManager } = request.services
    const userId = userIdFromHeaders(request.headers)
    // TODO use the properites in the body
    const updateUser = request.body
    await adminManager.updateUser(userId, {})
    reply.statusCode = StatusCodes.NO_CONTENT
}
