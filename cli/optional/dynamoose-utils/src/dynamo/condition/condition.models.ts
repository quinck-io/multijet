import { UpdateItemCommandInput } from '@aws-sdk/client-dynamodb'

export type InputCondition = Pick<
    UpdateItemCommandInput,
    | 'ConditionExpression'
    | 'ExpressionAttributeNames'
    | 'ExpressionAttributeValues'
>

export enum ConditionExpressionAggregator {
    AND = 'AND',
    OR = 'OR',
}

export enum ConditionExpressionComplexOperator {
    BETWEEN = 'between',
}

export enum ConditionExpressionSimpleOperator {
    GREATER_THAN = '>',
    LESS_THAN = '<',
    GREATER_THAN_OR_EQUAL = '>=',
    LESS_THAN_OR_EQUAL = '<=',
    EQUALS = '=',
    NOT_EQUALS = '<>',
}

export enum ConditionExpressionFunctionOperator {
    ATTRIBUTE_EXISTS = 'attribute_exists',
    ATTRIBUTE_NOT_EXISTS = 'attribute_not_exists',
}

export type ParsedValues = {
    expressionAttributeValues: NonNullable<
        InputCondition['ExpressionAttributeValues']
    >
    expressionAttributeValuesKeys: Record<string, string>
}

export type ConditionFactory = (
    attributeName: string,
    attributeValues: Record<string, string>,
) => string
