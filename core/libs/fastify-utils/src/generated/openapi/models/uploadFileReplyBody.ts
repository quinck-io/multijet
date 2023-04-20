/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ErrorData } from './ErrorData';

export type uploadFileReplyBody = ({
    filePath?: string;
    fileUrl?: string;
} | ErrorData);

