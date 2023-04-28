import { BasicController, Handler, User } from '@libs/fastify-utils'
import { AdminUserManager, UserAlreadyExistsError } from '@libs/user-manager'
import { StatusCodes } from 'http-status-codes'
import { AccountAlreadyExistsError } from './admin.errors'

export class AdminController extends BasicController {
    constructor(private readonly adminManager: AdminUserManager) {
        super(AdminController.name)
    }

    public createUser: Handler<'createUser'> = this.tryDo(
        async (request, reply) => {
            return this.handleUserManagerOperation(async () => {
                const { email } = request.body

                await this.adminManager.createUser(
                    { username: email },
                    { email },
                )

                reply.statusCode = StatusCodes.NO_CONTENT
                return null
            })
        },
    )

    public getUsers: Handler<'getUsers'> = this.tryDo(async () => {
        return this.handleUserManagerOperation(async () => {
            const users = await this.adminManager.searchUsers({})

            return {
                numberOfItems: users.length,
                items: users.map<User>(({ email, id }) => ({
                    email,
                    userId: id,
                })),
            }
        })
    })

    private async handleUserManagerOperation<X>(
        fun: () => Promise<X>,
    ): Promise<X> {
        try {
            return await fun()
        } catch (error) {
            if (error instanceof UserAlreadyExistsError)
                throw new AccountAlreadyExistsError()
            throw error
        }
    }
}
