import { isPresent } from "@quinck/type-utils"
import dynamoose from "dynamoose"
import {
    DynamoCommandErrorProps,
    MissingAttributesError,
    MissingItemError,
    NonValidCommandOutputError,
} from "../dynamo/errors/dynamo.errors"
import {
    DynamoDBItemCommandInput,
    DynamoDBItemCommandOutput,
    DynamoDBhandlerOptions,
} from "../dynamo/models/command.models"

export function unmarshallItemCommandOutput<Schema>(
    commandInput?: DynamoDBItemCommandInput,
    commandOutput?: DynamoDBItemCommandOutput,
    handlerOptions?: DynamoDBhandlerOptions,
    onMissingThrow: (error: Error) => Error = error => error,
): Schema {
    const ddbConverter = dynamoose.aws.converter()
    const errorProps: DynamoCommandErrorProps = {
        commandInput,
        commandOutput,
        handlerOptions,
    }

    if (isPresent(commandOutput)) {
        if ("Attributes" in commandOutput) {
            const { Attributes } = commandOutput
            if (isPresent(Attributes))
                return ddbConverter.unmarshall(Attributes) as Schema
            throw onMissingThrow(new MissingAttributesError(errorProps))
        }

        if ("Item" in commandOutput) {
            const { Item } = commandOutput
            if (isPresent(Item)) return ddbConverter.unmarshall(Item) as Schema
            throw onMissingThrow(new MissingItemError(errorProps))
        }
    }

    throw onMissingThrow(new NonValidCommandOutputError(errorProps))
}
