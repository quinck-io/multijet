import { UpdateItemCommandInput } from '@aws-sdk/client-dynamodb'

export type UpdateItemCommandInputUpdate = Pick<
    UpdateItemCommandInput,
    | 'ExpressionAttributeNames'
    | 'ExpressionAttributeValues'
    | 'UpdateExpression'
>

export type UpdateItemCommandInputKey = UpdateItemCommandInput['Key']

export enum UpdateExpressionVerb {
    SET = 'SET',
    REMOVE = 'REMOVE',
    ADD = 'ADD',
    DELETE = 'DELETE',
}

export enum UpdateSimpleOperator {
    EQUALS = '=',
}
