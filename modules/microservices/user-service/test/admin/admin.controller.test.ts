import { expect } from 'chai'
import 'mocha'
import { buildApp } from '../../src/app'
import { DummyAdminUserManager, DUMMY_NEW_USER } from '../mock.admin'
import { DummyAuthManager } from '../mock.auth'
import { DummyUserManager } from '../mock.user'

function getAppAndStorage() {
    const adminManager = new DummyAdminUserManager()
    const authManager = new DummyAuthManager()
    const userManager = new DummyUserManager()

    return {
        adminManager,
        app: buildApp(
            {
                adminManager,
                authManager,
                userManager,
            },
            { logger: false },
        ),
    }
}

describe('[user-service] AdminController', () => {
    describe('when asked to create a new user', () => {
        it('should reply with 204 if user was created', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/users',
                payload: DUMMY_NEW_USER,
            })
            expect(res.statusCode).equal(204)
        })

        it('should reply with 400 if email is malformed', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/users',
                payload: { email: '', customerId: '1' },
            })
            expect(res.statusCode).equal(400)
        })

        it('should reply with 500 if an unknown error occurred', async () => {
            const { app, adminManager } = getAppAndStorage()
            adminManager.error = new Error('generic error')
            const res = await app.inject({
                method: 'POST',
                url: '/users',
                payload: DUMMY_NEW_USER,
            })
            expect(res.statusCode).equal(500)
        })
    })
})
