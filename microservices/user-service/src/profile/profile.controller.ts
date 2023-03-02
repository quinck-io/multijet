import {
    BasicController,
    Handler,
    userIdFromHeaders,
} from '@libs/fastify-utils'
import { AdminUserManager, UserManager } from '@libs/user-manager'
import { StatusCodes } from 'http-status-codes'
import { parseUserProfile } from '../utils/users'

export class ProfileController extends BasicController {
    constructor(
        private readonly adminUserManager: AdminUserManager,
        private readonly userManager: UserManager,
    ) {
        super(ProfileController.name)
    }

    public signup: Handler<'signup'> = this.tryDo(async (request, reply) => {
        const { email, password } = request.body
        await this.userManager.signUp(
            {
                password,
                username: email,
            },
            { email },
        )

        reply.statusCode = StatusCodes.NO_CONTENT
        return null
    })

    public getUserProfile: Handler<'getUserProfile'> = this.tryDo(
        async request => {
            const userId = userIdFromHeaders(request.headers)
            const user = await this.adminUserManager.getUser(userId)
            return parseUserProfile(user)
        },
    )

    public updateUserProfile: Handler<'updateUserProfile'> = this.tryDo(
        async (request, reply) => {
            const userId = userIdFromHeaders(request.headers)
            // TODO use the properites in the body
            const updateUser = request.body
            await this.adminUserManager.updateUser(userId, {})
            reply.statusCode = StatusCodes.NO_CONTENT
            return null
        },
    )
}
