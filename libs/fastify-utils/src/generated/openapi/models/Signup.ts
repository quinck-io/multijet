/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NewUser } from './NewUser';
import type { Password } from './Password';

export type Signup = (NewUser & {
    password: Password;
});

