import { isPresent } from "@quinck/type-utils"
import {
    CommandInput,
    CommandOutput,
    HandlerOptions,
} from "../models/command.models"

export type DynamoCommandErrorProps = {
    commandInput?: CommandInput
    handlerOptions?: HandlerOptions
    commandOutput?: CommandOutput
}

export type DynamoCommandErrorPropsKey = keyof DynamoCommandErrorProps

export class BasicError extends Error {
    name = BasicError.name

    constructor(error?: unknown) {
        super(BasicError.formatMessage(error))
    }

    static formatMessage(error?: unknown): string {
        if (!isPresent(error)) return ""
        if (error instanceof Error) return `[${error.name}] ${error.message}`
        switch (typeof error) {
            case "bigint":
            case "number":
            case "boolean":
                return String(error)
            case "string":
                return error
            case "object":
                return error.toString()
            case "function":
                return `Function ${error.name}, with arguments ${error.arguments}`
            default:
                return ""
        }
    }
}

export class DynamoCommandError extends BasicError {
    name = DynamoCommandError.name
    constructor(props?: DynamoCommandErrorProps, error?: unknown) {
        super(error)
        if (isPresent(props)) {
            const { commandInput, commandOutput, handlerOptions } = props
            const commandInputAsString = DynamoCommandError.formatValueToString(
                "commandInput",
                commandInput,
            )
            const commandOutputAsString =
                DynamoCommandError.formatValueToString(
                    "commandOutput",
                    commandOutput,
                )
            const handlerOptionsAsString =
                DynamoCommandError.formatValueToString(
                    "handlerOptions",
                    handlerOptions,
                )
            this.message = [
                this.message,
                commandInputAsString,
                handlerOptionsAsString,
                commandOutputAsString,
            ].join("\n")
        }
    }
    private static formatValueToString(
        label: DynamoCommandErrorPropsKey,
        value?: unknown,
    ): string {
        return isPresent(value) ? [label, value].join("\n") : ""
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
