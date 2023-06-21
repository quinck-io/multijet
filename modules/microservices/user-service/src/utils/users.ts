import { UserProfile } from '@libs/models'
import { UserAttribute } from '@libs/user-manager'
import { CompleteUserInfo } from '@quinck/aws-cognito-client'

export function parseUserProfile(
    user: CompleteUserInfo<UserAttribute>,
): UserProfile {
    const { email, id } = user
    return {
        email,
        userId: id,
    }
}
