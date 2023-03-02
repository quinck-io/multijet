import { expect } from 'chai'
import 'mocha'
import { buildApp } from '../../src/app'
import { DummyAdminUserManager } from '../mock.admin'
import {
    DummyAuthManager,
    DUMMY_EMAIL,
    DUMMY_FIRST_LOGIN_PAYLOAD,
    DUMMY_RESET_PASSWORD_PAYLOAD,
    DUMMY_USER_PAYLOAD,
} from '../mock.auth'
import { DummyUserManager } from '../mock.user'
import { mockHeaders, mockWrongHeaders } from '../utils/mock'

function getAppAndStorage() {
    const adminManager = new DummyAdminUserManager()
    const authManager = new DummyAuthManager()
    const userManager = new DummyUserManager()
    return {
        adminManager,
        authManager,
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

describe('[user-service] AuthController', () => {
    describe('when user logs in', () => {
        it('should reply with 200 if the operation was succesful', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: DUMMY_USER_PAYLOAD,
            })
            expect(res.statusCode).equal(200)
        })

        it('should reply with 400 if email is malformed', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: '',
                    password: '',
                },
            })
            expect(res.statusCode).equal(400)
        })

        it('should reply with 500 if password is wrong', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: { email: 'prova@prova.com', password: '' },
            })
            expect(res.statusCode).equal(500)
        })

        it('should reply with 400 if body is malformed', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: { a: '', b: '' },
            })
            expect(res.statusCode).equal(400)
        })

        it('should reply with 500 if an unknown error occurred', async () => {
            const { app, authManager } = getAppAndStorage()
            authManager.error = new Error('generic error')

            const res = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: DUMMY_USER_PAYLOAD,
            })
            expect(res.statusCode).equal(500)
        })
    })

    describe('when asked to refresh user token', () => {
        it('should reply with 200 if the operation was succesful', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/login/refresh',
                headers: mockHeaders,
            })
            expect(res.statusCode).equal(200)
        })

        it('should reply with 500 if the refresh token is wrong', async () => {
            const { app, authManager } = getAppAndStorage()
            authManager.error = new Error('generic error')
            const res = await app.inject({
                method: 'POST',
                url: '/auth/login/refresh',
                headers: mockWrongHeaders,
            })
            expect(res.statusCode).equal(500)
        })

        it('should reply with 500 if an unknown error occurred', async () => {
            const { app, authManager } = getAppAndStorage()
            authManager.error = new Error('generic error')

            const res = await app.inject({
                method: 'POST',
                url: '/auth/login/refresh',
                headers: mockHeaders,
            })
            expect(res.statusCode).equal(500)
        })
    })

    describe('when user wants to complete a force change password challenge', () => {
        it('should reply with 200 if the operation was succesful', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/signup/forceChangePassword',
                payload: DUMMY_FIRST_LOGIN_PAYLOAD,
            })
            expect(res.statusCode).equal(200)
        })

        it('should reply with 500 if the temporary code is wrong ', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/signup/forceChangePassword',
                payload: {
                    email: 'prova@prova.com',
                    temporaryPassword: '',
                    newPassword: 'password987',
                },
            })
            expect(res.statusCode).equal(500)
        })

        it('should reply with 400 if body is malformed', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/signup/forceChangePassword',
                payload: {},
            })
            expect(res.statusCode).equal(400)
        })

        it('should reply with 400 if email is malformed ', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/signup/forceChangePassword',
                payload: {
                    email: '',
                    temporaryPassword: '',
                    newPassword: 'password987',
                },
            })
            expect(res.statusCode).equal(400)
        })

        it('should reply with 500 if an unkown error occurred', async () => {
            const { app, authManager } = getAppAndStorage()
            authManager.error = new Error('generic error')

            const res = await app.inject({
                method: 'POST',
                url: '/auth/signup/forceChangePassword',
                payload: DUMMY_FIRST_LOGIN_PAYLOAD,
            })
            expect(res.statusCode).equal(500)
        })
    })
    describe('when asked to dispatch a forgot password action', () => {
        it('should reply with 204 if the operation was succesful', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/forgotPassword',
                payload: { email: DUMMY_EMAIL },
            })
            expect(res.statusCode).equal(204)
        })

        it('should reply with 400 if email is malformed', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/forgotPassword',
                payload: { email: '' },
            })
            expect(res.statusCode).equal(400)
        })

        it('should reply with 500 if unkown error occurred', async () => {
            const { app, authManager } = getAppAndStorage()
            authManager.error = new Error('generic error')

            const res = await app.inject({
                method: 'POST',
                url: '/auth/forgotPassword',
                payload: { email: DUMMY_EMAIL },
            })
            expect(res.statusCode).equal(500)
        })
    })

    describe('when asked to dispatch a reset password action', () => {
        it('should reply with 204 if the operation was succesful', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/resetPassword',
                payload: DUMMY_RESET_PASSWORD_PAYLOAD,
            })
            expect(res.statusCode).equal(204)
        })

        it('should reply with 400 if email is malformed', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/resetPassword',
                payload: {
                    email: '',
                    temporaryPassword: 'password123',
                    newPassword: 'password987',
                },
            })
            expect(res.statusCode).equal(400)
        })

        it('should reply with 500 if confirmation code is wrong', async () => {
            const { app } = getAppAndStorage()
            const res = await app.inject({
                method: 'POST',
                url: '/auth/resetPassword',
                payload: {
                    email: DUMMY_EMAIL,
                    temporaryPassword: '',
                    newPassword: 'password987',
                },
            })
            expect(res.statusCode).equal(500)
        })

        it('should reply with 500 if an unknown error occurred', async () => {
            const { app, authManager } = getAppAndStorage()
            authManager.error = new Error('generic error')
            const res = await app.inject({
                method: 'POST',
                url: '/auth/resetPassword',
                payload: DUMMY_RESET_PASSWORD_PAYLOAD,
            })
            expect(res.statusCode).equal(500)
        })
    })
})
