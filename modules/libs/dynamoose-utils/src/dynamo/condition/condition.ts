import {
    Alias,
    ATTRIBUTE_JOIN,
    composeAttributeName,
    ExpressionAttributeNames,
    expressionAttributeValue,
    FieldName,
    mergeRecords,
    toBeRemoved,
} from '../dynamo.utils'
import {
    ConditionExpressionAggregator,
    ConditionExpressionComplexOperator,
    ConditionExpressionFunctionOperator,
    ConditionExpressionSimpleOperator,
    ConditionFactory,
    InputCondition,
    ParsedValues,
} from './condition.models'

import { aws } from 'dynamoose'

const FROM = 'from'
const TO = 'to'

export class Condition {
    constructor(
        private readonly composedAttributeName: string,
        private readonly ExpressionAttributeNames: ExpressionAttributeNames,
    ) {}

    public static create(nameParts: [FieldName, Alias][]): Condition {
        const [composedAttributeName, attributeNames] =
            composeAttributeName(nameParts)

        return new Condition(composedAttributeName, attributeNames)
    }

    public static is = Condition.create

    public static isListItem(
        listNameParts: [FieldName, Alias][],
        index: number,
        propNameParts: [FieldName, Alias][],
    ): Condition {
        const [listAttr, listAttrNames] = composeAttributeName(listNameParts)

        const [propsAttr, propsAttrNames] = composeAttributeName(propNameParts)

        const composedAttributeName = `${listAttr}[${index}]${ATTRIBUTE_JOIN}${propsAttr}`

        return new Condition(
            composedAttributeName,
            mergeRecords(listAttrNames, propsAttrNames),
        )
    }

    public like(
        operator: ConditionExpressionSimpleOperator,
        value: unknown,
    ): InputCondition {
        return this.condition(
            (nameKey, values) =>
                `${nameKey} ${operator} ${values[this.composedAttributeName]}`,
            { [this.composedAttributeName]: value },
        )
    }

    public trueThat(
        operator: ConditionExpressionFunctionOperator,
    ): InputCondition {
        return this.condition(nameKey => `${operator}(${nameKey})`)
    }

    public between(from: unknown, to: unknown): InputCondition {
        const fromValueKey = `${FROM}${this.composedAttributeName}`
        const toValueKey = `${TO}${this.composedAttributeName}`
        const values = { [fromValueKey]: from, [toValueKey]: to }
        return this.condition(
            (name, values) =>
                `${name} ${ConditionExpressionComplexOperator.BETWEEN} ${values[fromValueKey]} ${ConditionExpressionAggregator.AND} ${values[toValueKey]}`,
            values,
        )
    }

    public condition(
        condition: ConditionFactory,
        values?: Record<string, unknown>,
    ): InputCondition {
        const updateCondition: InputCondition = {
            ExpressionAttributeNames: this.ExpressionAttributeNames,
        }
        if (values) {
            const { expressionAttributeValues, expressionAttributeValuesKeys } =
                this.conditionValues(values)
            updateCondition.ExpressionAttributeValues =
                expressionAttributeValues
            updateCondition.ConditionExpression = condition(
                this.composedAttributeName,
                expressionAttributeValuesKeys,
            )
        } else {
            updateCondition.ConditionExpression = condition(
                this.composedAttributeName,
                {},
            )
        }

        return updateCondition
    }

    private conditionValues(values: Record<string, unknown>): ParsedValues {
        const initial: ParsedValues = {
            expressionAttributeValues: {},
            expressionAttributeValuesKeys: {} as Record<string, string>,
        }

        return Object.entries(values).reduce((result, [key, value]) => {
            const attributeValue = expressionAttributeValue(
                key.replace(toBeRemoved, ''),
            )
            result.expressionAttributeValues[attributeValue] = aws
                .converter()
                .convertToAttr(value)

            result.expressionAttributeValuesKeys[key] = attributeValue

            return result
        }, initial)
    }
}
