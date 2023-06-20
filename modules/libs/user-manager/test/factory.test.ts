import { expect } from 'chai'
import 'mocha'
import {
    createAdminManager,
    createAuthManager,
    createUserManager
} from '../src'

const MOCK_USER_POOL = 'eu-west-1_AAAAAAAAA'
const MOCK_USER_POOL_CLIENT_ID = '1234567890abcdefghil123abc'

describe('createAdminManager', () => {
    it('should allow to create a user administration manager service without errors', () => {
        expect(
            createAdminManager.bind(createAdminManager, MOCK_USER_POOL),
        ).to.not.throw()
    })

    it('should allow to create a well defined user administration manager service', () => {
        const manager = createAdminManager(MOCK_USER_POOL)
        expect(manager).to.not.be.undefined
    })

    it('should allow to create a non null user administration manager service', () => {
        const manager = createAdminManager(MOCK_USER_POOL)
        expect(manager).to.not.be.null
    })
})

describe('createAuthManager', () => {
    it('should allow to create a user administration manager service without errors', () => {
        expect(
            createAuthManager.bind(
                createAuthManager,
                MOCK_USER_POOL,
                MOCK_USER_POOL_CLIENT_ID,
            ),
        ).to.not.throw()
    })

    it('should allow to create a well defined user administration manager service', () => {
        const manager = createAuthManager(
            MOCK_USER_POOL,
            MOCK_USER_POOL_CLIENT_ID,
        )
        expect(manager).to.not.be.undefined
    })

    it('should allow to create a non null user administration manager service', () => {
        const manager = createAuthManager(
            MOCK_USER_POOL,
            MOCK_USER_POOL_CLIENT_ID,
        )
        expect(manager).to.not.be.null
    })
})

describe('createUserManager', () => {
    it('should allow to create a user administration manager service without errors', () => {
        expect(
            createUserManager.bind(
                createUserManager,
                MOCK_USER_POOL,
                MOCK_USER_POOL_CLIENT_ID,
            ),
        ).to.not.throw()
    })

    it('should allow to create a well defined user administration manager service', () => {
        const manager = createUserManager(
            MOCK_USER_POOL,
            MOCK_USER_POOL_CLIENT_ID,
        )
        expect(manager).to.not.be.undefined
    })

    it('should allow to create a non null user administration manager service', () => {
        const manager = createUserManager(
            MOCK_USER_POOL,
            MOCK_USER_POOL_CLIENT_ID,
        )
        expect(manager).to.not.be.null
    })
})
