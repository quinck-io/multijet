/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Paginated } from './Paginated';
import type { User } from './User';

export type PaginatedUsers = (Paginated & {
    items: Array<User>;
});

