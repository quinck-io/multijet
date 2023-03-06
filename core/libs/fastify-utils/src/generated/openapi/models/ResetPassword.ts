/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Email } from './Email';
import type { Password } from './Password';

export type ResetPassword = {
    email: Email;
    temporaryPassword: Password;
    newPassword: Password;
};

