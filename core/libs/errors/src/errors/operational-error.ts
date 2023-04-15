/**
 * Operational errors represent runtime problems whose results
 * are expected and should be dealt with in a proper way.
 * Operational errors don’t mean the application itself has bugs,
 * but developers need to handle them thoughtfully.
 */
export class OperationalError extends Error {
    public readonly isOperational: boolean = true

    /**
     * Creates a new instance of an OperationalError.
     * @param message the message of the error
     * @param options options to provide additional information, like a cause error
     * @constructs OperationalError
     */
    protected constructor(message: string, options?: ErrorOptions) {
        super(message, options)
        Object.setPrototypeOf(this, new.target.prototype)

        Error.captureStackTrace(this)
    }
}
