import { ReturnValue, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb'
import { Builder, isPresent } from '@libs/utils'
import dynamoose from 'dynamoose'
import {
    ConditionExpressionAggregator,
    InputCondition,
} from '../condition/condition.models'
import { aggregateInputCondition } from '../condition/condition.utils'
import { mergeRecords } from '../dynamo.utils'
import {
    UpdateItemCommandInputOptionalProps,
    UpdateItemCommandInputRequiredProps,
} from './update-builder.models'
import {
    UpdateExpressionVerb,
    UpdateItemCommandInputUpdate,
} from './update-item.models'

export class UpdateItemCommandInputBuilder
    implements Builder<UpdateItemCommandInput>
{
    private updates: UpdateItemCommandInputUpdate[] = []
    private conditions: InputCondition[] = []
    private verb?: UpdateExpressionVerb
    private conditionAggregator?: ConditionExpressionAggregator
    private key?: UpdateItemCommandInput['Key']
    private requiredProps?: UpdateItemCommandInputRequiredProps
    private optionalProps?: UpdateItemCommandInputOptionalProps
    private returnValue?: ReturnValue

    public static create(): UpdateItemCommandInputBuilder {
        return new UpdateItemCommandInputBuilder()
    }

    public addUpdates(
        ...update: UpdateItemCommandInputUpdate[]
    ): UpdateItemCommandInputBuilder {
        this.updates = this.updates.concat(update)
        return this
    }

    public addConditions(
        ...condition: InputCondition[]
    ): UpdateItemCommandInputBuilder {
        this.conditions = this.conditions.concat(condition)
        return this
    }

    public setKey(key: Record<string, unknown>): UpdateItemCommandInputBuilder {
        this.key = dynamoose.aws.converter().marshall(key)
        return this
    }

    public setVerb(verb: UpdateExpressionVerb): UpdateItemCommandInputBuilder {
        this.verb = verb
        return this
    }

    public setConditionAggregator(
        conditionAggregator?: ConditionExpressionAggregator,
    ): UpdateItemCommandInputBuilder {
        this.conditionAggregator = conditionAggregator
        return this
    }

    public setRequiredProps(
        requiredProps?: UpdateItemCommandInputRequiredProps,
    ): UpdateItemCommandInputBuilder {
        this.requiredProps = requiredProps
        return this
    }

    public setOptionalProps(
        optionalProps?: UpdateItemCommandInputOptionalProps,
    ): UpdateItemCommandInputBuilder {
        this.optionalProps = optionalProps
        return this
    }

    public setReturnValue(
        returnValue: ReturnValue,
    ): UpdateItemCommandInputBuilder {
        this.returnValue = returnValue
        return this
    }

    private mergeUpdateAndConditions(
        update: UpdateItemCommandInputUpdate,
        condition: InputCondition,
    ): UpdateItemCommandInputUpdate & InputCondition {
        const { UpdateExpression } = update
        const { ConditionExpression } = condition

        const result: UpdateItemCommandInputUpdate & InputCondition = {
            ConditionExpression,
            UpdateExpression,
        }

        const names = mergeRecords(
            update.ExpressionAttributeNames,
            condition.ExpressionAttributeNames,
        )

        const values = mergeRecords(
            update.ExpressionAttributeValues,
            condition.ExpressionAttributeValues,
        )

        if (this.hasAtLeastOneProperty(names))
            result.ExpressionAttributeNames = names

        if (this.hasAtLeastOneProperty(values))
            result.ExpressionAttributeValues = values

        return result
    }

    private aggregateUpdateItemCommandInputUpdate(): UpdateItemCommandInputUpdate {
        if (!isPresent(this.verb)) throw new Error('verb is required')
        if (this.updates.length <= 0) return {}

        const concatenatedUpdates = this.updates.reduce((prev, curr) => {
            return {
                UpdateExpression: `${prev.UpdateExpression}, ${curr.UpdateExpression}`,
                ExpressionAttributeNames: mergeRecords(
                    prev.ExpressionAttributeNames,
                    curr.ExpressionAttributeNames,
                ),
                ExpressionAttributeValues: mergeRecords(
                    prev.ExpressionAttributeValues,
                    curr.ExpressionAttributeValues,
                ),
            }
        })

        return {
            ...concatenatedUpdates,
            UpdateExpression: `${this.verb} ${concatenatedUpdates.UpdateExpression}`,
        }
    }

    private hasAtLeastOneProperty<Value>(
        props: Record<string, Value>,
    ): boolean {
        return Object.entries(props).length > 0
    }

    build(): UpdateItemCommandInput {
        if (!isPresent(this.key)) throw new Error('key is required')
        if (!isPresent(this.requiredProps))
            throw new Error('required props are required')

        const update = this.aggregateUpdateItemCommandInputUpdate()
        const condition = aggregateInputCondition(
            this.conditions,
            this.conditionAggregator,
        )
        const updateAndCondition = this.mergeUpdateAndConditions(
            update,
            condition,
        )

        return {
            Key: this.key,
            ...this.requiredProps,
            ...updateAndCondition,
            ...(this.optionalProps || {}),
            ReturnValues: this.returnValue,
        }
    }
}
