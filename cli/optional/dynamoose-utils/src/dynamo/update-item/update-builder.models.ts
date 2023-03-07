import { UpdateItemCommandInput } from '@aws-sdk/client-dynamodb'
import { InputCondition } from '../condition/condition.models'
import { UpdateItemCommandInputUpdate } from './update-item.models'

export type UpdateItemCommandInputRequiredProps = Pick<
    UpdateItemCommandInput,
    'TableName'
>

export type UpdateItemCommandInputOptionalProps = Omit<
    UpdateItemCommandInput,
    | keyof UpdateItemCommandInputRequiredProps
    | keyof UpdateItemCommandInputUpdate
    | keyof InputCondition
    | 'Key'
    | 'ReturnValues'
>
