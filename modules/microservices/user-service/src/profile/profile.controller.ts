import { Handlers, userIdFromHeaders } from '@libs/fastify-utils'
import { AdminUserManager, UserManager } from '@libs/user-manager'
import { StatusCodes } from 'http-status-codes'
import { parseUserProfile } from '../utils/users'

export class ProfileController {
    constructor(
        private readonly adminUserManager: AdminUserManager,
        private readonly userManager: UserManager, // TODO: remove if not needed
    ) {}

    public getUserProfile: Handlers['getUserProfile'] = async request => {
        const userId = userIdFromHeaders(request.headers)
        const user = await this.adminUserManager.getUser(userId)
        return parseUserProfile(user)
    }

    public updateUserProfile: Handlers['updateUserProfile'] = async (
        request,
        reply,
    ) => {
        const userId = userIdFromHeaders(request.headers)
        // TODO use the properites in the body
        const updateUser = request.body
        await this.adminUserManager.updateUser(userId, {})
        reply.statusCode = StatusCodes.NO_CONTENT
        return null
    }
}
