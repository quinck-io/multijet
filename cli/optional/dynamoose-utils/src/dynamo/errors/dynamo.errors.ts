import { BasicError, isPresent } from '@libs/utils'
import {
    CommandInput,
    CommandOutput,
    HandlerOptions,
} from '../models/command.models'

export type DynamoCommandErrorProps = {
    commandInput?: CommandInput
    handlerOptions?: HandlerOptions
    commandOutput?: CommandOutput
}

export type DynamoCommandErrorPropsKey = keyof DynamoCommandErrorProps

export class DynamoCommandError extends BasicError {
    name = DynamoCommandError.name
    constructor(props?: DynamoCommandErrorProps, error?: unknown) {
        super(error)
        if (isPresent(props)) {
            const { commandInput, commandOutput, handlerOptions } = props
            const commandInputAsString = DynamoCommandError.formatValueToString(
                'commandInput',
                commandInput,
            )
            const commandOutputAsString =
                DynamoCommandError.formatValueToString(
                    'commandOutput',
                    commandOutput,
                )
            const handlerOptionsAsString =
                DynamoCommandError.formatValueToString(
                    'handlerOptions',
                    handlerOptions,
                )
            this.message = [
                this.message,
                commandInputAsString,
                handlerOptionsAsString,
                commandOutputAsString,
            ].join('\n')
        }
    }
    private static formatValueToString(
        label: DynamoCommandErrorPropsKey,
        value?: unknown,
    ): string {
        return isPresent(value) ? [label, value].join('\n') : ''
    }
}

export class MissingAttributesError extends DynamoCommandError {
    name = MissingAttributesError.name
}

export class MissingItemError extends DynamoCommandError {
    name = MissingItemError.name
}
export class NonValidCommandOutputError extends DynamoCommandError {
    name = NonValidCommandOutputError.name
}
