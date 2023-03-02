import { expect } from 'chai'
import 'mocha'
import { buildApp } from '../../src/app'
import { DummyAdminUserManager } from '../mock.admin'
import { DummyAuthManager } from '../mock.auth'
import { DummyUserManager, DUMMY_USER_REPLY } from '../mock.user'
import { mockHeaders } from '../utils/mock'

function getAppAndStorage() {
    const adminManager = new DummyAdminUserManager()
    const authManager = new DummyAuthManager()
    const userManager = new DummyUserManager()
    return {
        adminManager,
        authManager,
        userManager,
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

describe('[user-service] ProfileController', () => {
    describe('when asked to retrieve profile information', () => {
        it('should reply with 200 if the operation was succesful', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'GET',
                url: '/profile',
                headers: mockHeaders,
            })

            const resBody = JSON.parse(res.body)
            expect(resBody).deep.equal(DUMMY_USER_REPLY)
            expect(res.statusCode).equal(200)
        })

        it('should reply with 500 if an unkown error occurred', async () => {
            const { app, adminManager } = getAppAndStorage()
            adminManager.error = new Error('generic error')

            const res = await app.inject({
                method: 'GET',
                url: '/profile',
                headers: mockHeaders,
            })
            expect(res.statusCode).equal(500)
        })
    })

    describe('when user wants to signup', () => {
        it('should reply with 204 if operation was succesful', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/signup',
                payload: {
                    email: 'a@a.com',
                    password: 'password123',
                },
            })
            expect(res.statusCode).equal(204)
        })
    })
})
