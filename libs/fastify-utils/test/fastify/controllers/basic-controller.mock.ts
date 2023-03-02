import { BasicController } from '../../../src'

export const MOCK_NAME = 'MOCK_NAME'

export class TestBasicController extends BasicController {
    constructor() {
        super(MOCK_NAME)
    }

    /**
     * Test added properties and methods
     */

    public errorToErrorResponseCaller = this.errorToErrorResponse

    public serviceErrorToErrorResponseCaller = this.serviceErrorToErrorResponse
}
