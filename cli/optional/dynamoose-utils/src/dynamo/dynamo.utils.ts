import { UpdateItemCommandInput } from '@aws-sdk/client-dynamodb'

export const VALUE_PREFIX = ':'
export const NAME_PREFIX = '#'
export const expressionAttributeName = (fieldName: string) =>
    `${NAME_PREFIX}${fieldName}`

export const expressionAttributeValue = (fieldName: string) =>
    `${VALUE_PREFIX}${fieldName}`

export const ATTRIBUTE_JOIN = '.'

export type ExpressionAttributeNames = NonNullable<
    UpdateItemCommandInput['ExpressionAttributeNames']
>
export type ComposedAttributeName = string
export type FieldName = string
export type Alias = string | undefined

export function composeAttributeName(
    nameParts: [FieldName, Alias][],
): [ComposedAttributeName, ExpressionAttributeNames] {
    const attributeNames: ExpressionAttributeNames = {}
    const composedAttributeName = nameParts
        .reduce((finalAttributeName, [field, alias]) => {
            const attributeNameKey = alias ?? field
            const attributeName = expressionAttributeName(attributeNameKey)
            attributeNames[attributeName] = field
            finalAttributeName.push(attributeName)
            return finalAttributeName
        }, [] as string[])
        .join(ATTRIBUTE_JOIN)

    return [composedAttributeName, attributeNames]
}

export function mergeRecords<Value>(
    a?: Record<string, Value> | undefined,
    b?: Record<string, Value> | undefined,
): Record<string, Value> {
    return {
        ...(a || {}),
        ...(b || {}),
    }
}

export const toBeRemoved = new RegExp(
    `[${NAME_PREFIX}|${ATTRIBUTE_JOIN}|\\[|\\]]]*`,
    'g',
)
