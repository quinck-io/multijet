import { IncomingHttpHeaders } from 'http2'
import { jwtDecode } from 'jwt-decode'
// import { BadRequestError, FrobiddenError } from '../errors/common'
// import { UserRole } from '../generated/openapi'

export type TokenHeaderKey = keyof TokenHeader

export type TokenHeader = IncomingHttpHeaders & {
    'x-access-token'?: string
    'x-refresh-token'?: string
}

export type BasicAuthHeader = Pick<IncomingHttpHeaders, 'authorization'>

export type UserAuthHeader = Pick<
    TokenHeader,
    'authorization' | 'x-access-token'
>

export type UserToken = {
    readonly accessToken: string
    readonly authorization: string
    readonly refreshToken: string
}

export type BasicAuthToken = Pick<UserToken, 'authorization'>

export type UserAuthToken = Pick<UserToken, 'authorization' | 'accessToken'>

export type RefreshAuthToken = Pick<UserToken, 'refreshToken'>

export function formatUserToken(token: TokenHeader): UserToken {
    return {
        accessToken: formatToken(token['x-access-token']),
        authorization: formatToken(token['authorization']),
        refreshToken: formatToken(token['x-refresh-token']),
    }
}

export function formatBasicAuthToken(token: TokenHeader): BasicAuthToken {
    return {
        authorization: formatToken(token.authorization),
    }
}

export function formatUserAuthToken(token: TokenHeader): UserAuthToken {
    return {
        accessToken: formatToken(token['x-access-token']),
        authorization: formatToken(token.authorization),
    }
}

export function formatRefreshAuthToken(token: TokenHeader): RefreshAuthToken {
    return {
        refreshToken: formatToken(token['x-refresh-token']),
    }
}

export function formatToken(token?: string): string {
    if (token) return token.startsWith('Bearer ') ? token.split(' ')[1] : token
    return ''
}

export function userIdFromHeaders(headers: TokenHeader): string {
    return resourceFromToken(formatBasicAuthToken(headers), 'cognito:username')
}

export function isUserInGroups(token: UserToken, groups: string[]): boolean {
    return getUserGroupsFromToken(token)['cognito:groups'].some(x =>
        groups.includes(x),
    )
}

export function getUserGroupsFromToken(token: UserToken): UserWithGroups {
    return {
        'cognito:groups':
            jwtDecode<UserWithGroups>(token.authorization)['cognito:groups'] ||
            [],
    }
}

// export function userHasRole(headers: TokenHeader, roles: UserRole[]): boolean {
//     try {
//         return isUserInGroups(formatUserToken(headers), roles)
//     } catch (error) {
//         throw new BadRequestError(error as Error)
//     }
// }

// export function assertRole(headers: TokenHeader, roles: UserRole[]): void {
//     if (!userHasRole(headers, roles)) throw new FrobiddenError()
// }

export type IdTokenStructure = {
    'cognito:username': string
}

export interface UserWithGroups {
    'cognito:groups': string[]
}

export function resourceFromToken(
    { authorization }: BasicAuthToken,
    resource: keyof IdTokenStructure,
): string {
    const decodedToken = jwtDecode<IdTokenStructure>(authorization)
    return decodedToken[resource]
}

export function userIdFromToken(authorization: string): string {
    return resourceFromToken({ authorization }, 'cognito:username')
}
