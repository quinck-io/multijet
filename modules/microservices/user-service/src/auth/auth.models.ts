import { AuthManager } from '@libs/user-manager'

export type AuthManagerLogin = Awaited<ReturnType<AuthManager['login']>>
