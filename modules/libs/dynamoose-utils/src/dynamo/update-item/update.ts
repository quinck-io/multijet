import '@quinck/collections'
import dynamoose from 'dynamoose'
import {
    Alias,
    composeAttributeName,
    ExpressionAttributeNames,
    expressionAttributeValue,
    FieldName,
    toBeRemoved,
} from '../dynamo.utils'
import {
    UpdateItemCommandInputUpdate,
    UpdateSimpleOperator,
} from './update-item.models'

export class Update {
    constructor(
        private readonly composedAttributeName: string,
        private readonly ExpressionAttributeNames: ExpressionAttributeNames,
    ) {}

    public static of = Update.create

    public static create(nameParts: [FieldName, Alias][]): Update {
        const [composedAttributeName, attributeNames] =
            composeAttributeName(nameParts)

        return new Update(composedAttributeName, attributeNames)
    }

    public simpleGenericUpdate(
        operator: UpdateSimpleOperator,
        value: unknown,
    ): UpdateItemCommandInputUpdate {
        const attributeValue = expressionAttributeValue(
            this.composedAttributeName.replace(toBeRemoved, ''),
        )
        return {
            UpdateExpression: `${this.composedAttributeName} ${operator} ${attributeValue}`,
            ExpressionAttributeNames: this.ExpressionAttributeNames,
            ExpressionAttributeValues: {
                [attributeValue]: dynamoose.aws
                    .converter()
                    .convertToAttr(value),
            },
        }
    }

    removingItemWithIndex(index: number): UpdateItemCommandInputUpdate {
        return {
            UpdateExpression: `${this.composedAttributeName}[${index}]`,
            ExpressionAttributeNames: this.ExpressionAttributeNames,
        }
    }

    with(value: unknown): UpdateItemCommandInputUpdate {
        return this.simpleGenericUpdate(UpdateSimpleOperator.EQUALS, value)
    }

    public listAppend(values: unknown[]): UpdateItemCommandInputUpdate {
        const attributeValue = expressionAttributeValue(
            this.composedAttributeName.replace(toBeRemoved, ''),
        )
        return {
            UpdateExpression: `${this.composedAttributeName} ${UpdateSimpleOperator.EQUALS} list_append(${this.composedAttributeName}, ${attributeValue})`,
            ExpressionAttributeNames: this.ExpressionAttributeNames,
            ExpressionAttributeValues: {
                [attributeValue]: dynamoose.aws
                    .converter()
                    .convertToAttr(values),
            },
        }
    }
}
