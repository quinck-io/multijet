/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ErrorCode } from './ErrorCode';

/**
 * Informations regarding a backend error
 */
export type ErrorData = {
    description: string;
    errorCode: ErrorCode;
    inputId?: string;
};

