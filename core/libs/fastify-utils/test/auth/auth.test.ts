import { expect } from 'chai'
import 'mocha'
import {
    formatRefreshAuthToken,
    formatToken,
    formatUserAuthToken,
    formatUserToken,
    RefreshAuthToken,
    UserAuthToken,
    userIdFromHeaders,
} from '../../src'
import { FASTIFY_UTILS } from '../labels'
import {
    DUMMY_EXPECTED_USER_ID,
    DUMMY_USER_TOKENS,
    mockHeaders,
    mockIdToken,
    mockUnformattedIdToken,
} from './auth.mock'

describe(`${FASTIFY_UTILS} auth`, () => {
    describe('when asked to format a token', () => {
        it('should not throw any errors', () => {
            expect(formatToken.bind(formatToken, '')).to.not.throw()
        })

        it('should return the formatted token', () => {
            const token = formatToken(mockUnformattedIdToken)
            expect(token).equal(mockIdToken)
        })

        it('should return an empty string if token is undefined', () => {
            const token = formatToken()
            expect(token).equal('')
        })
    })

    describe('when asked to format a user token', () => {
        it('should not throw any errors', () => {
            expect(
                formatUserToken.bind(formatUserToken, mockHeaders),
            ).to.not.throw()
        })

        it('should return the correct tokens', () => {
            const tokens = formatUserToken(mockHeaders)
            expect(tokens).deep.equal(DUMMY_USER_TOKENS)
        })
    })

    describe('when asked to format a user self authentication token', () => {
        it('should not throw any errors', () => {
            expect(
                formatUserAuthToken.bind(formatUserAuthToken, mockHeaders),
            ).to.not.throw()
        })

        it('should return the correct tokens', () => {
            const tokens = formatUserAuthToken(mockHeaders)
            const expected: UserAuthToken = {
                accessToken: DUMMY_USER_TOKENS.accessToken,
                authorization: DUMMY_USER_TOKENS.authorization,
            }
            expect(tokens).deep.equal(expected)
        })
    })

    describe('when asked to format a user refresh token', () => {
        it('should not throw any errors', () => {
            expect(
                formatRefreshAuthToken.bind(
                    formatRefreshAuthToken,
                    mockHeaders,
                ),
            ).to.not.throw()
        })

        it('should return the correct tokens', () => {
            const tokens = formatRefreshAuthToken(mockHeaders)
            const expected: RefreshAuthToken = {
                refreshToken: DUMMY_USER_TOKENS.refreshToken,
            }
            expect(tokens).deep.equal(expected)
        })
    })

    describe('when asked to get userId from headers', () => {
        it('should not throw any errors', () => {
            expect(
                userIdFromHeaders.bind(userIdFromHeaders, mockHeaders),
            ).to.not.throw()
        })

        it('should return the correct userId', () => {
            const userId = userIdFromHeaders(mockHeaders)
            expect(userId).equal(DUMMY_EXPECTED_USER_ID)
        })
    })

    // describe('when asked to assert the roles of the logged user', () => {
    //     it('should not throw any errors', () => {
    //         expect(
    //             assertRole.bind(assertRole, mockHeaders, mockRoles),
    //         ).to.not.throw()
    //     })

    //     it('should not authorize a user that does not have the nrequired roles', () => {
    //         expect(
    //             assertRole.bind(assertRole, mockHeaders, [UserRole.ADMIN]),
    //         ).to.throw(FrobiddenError)
    //     })

    //     it('should allow a user to have a token without group and authorize it if no role are required', () => {
    //         expect(
    //             assertRole.bind(assertRole, mockHeadersWithoutGroups, []),
    //         ).to.throw(FrobiddenError)
    //     })

    //     it('should allow a user to have a token without group and not authorize it if a role is required', () => {
    //         expect(
    //             assertRole.bind(assertRole, mockHeadersWithoutGroups, [
    //                 UserRole.ADMIN,
    //             ]),
    //         ).to.throw(FrobiddenError)
    //     })

    //     it('should reply bad request if the token was not correctly formatted', () => {
    //         expect(
    //             assertRole.bind(
    //                 assertRole,
    //                 {
    //                     authorization: 'wrong_token',
    //                 },
    //                 [UserRole.ADMIN],
    //             ),
    //         ).to.throw(BadRequestError)
    //     })

    //     it('should reply bad request if the token is missing', () => {
    //         expect(
    //             assertRole.bind(assertRole, mockEmptyHeaders, [UserRole.ADMIN]),
    //         ).to.throw(BadRequestError)
    //     })
    // })
})
