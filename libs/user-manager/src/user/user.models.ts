import {
    AdminUserService,
    AuthService,
    UserService,
} from '@quinck/aws-cognito-client'
import { UserStructure } from '@quinck/aws-cognito-client/lib/aws-cognito/models/users'
import { createUserAttribute } from '@quinck/aws-cognito-client/lib/aws-cognito/utils'

// ------------------User models configuration-----------------

// TODO: define your user properties here
export type UserAttribute = {
    email: string
}

// TODO: define the user update properties here
export type UserUpdateAttribute = Record<string, never>

// TODO: define the cognito specific user properties
export const userStructure: UserStructure<UserAttribute> = {
    email: createUserAttribute('email'),
}

// ------------------------------------------------------------

export type AdminUserManager = AdminUserService<
    UserAttribute,
    UserUpdateAttribute,
    UserAttribute
>

export type UserManager = UserService<
    UserAttribute,
    UserUpdateAttribute,
    UserAttribute
>

export type AuthManager = AuthService
