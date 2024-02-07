import { isPresent } from "@quinck/type-utils"
import { mergeRecords } from "../dynamo.utils"
import {
    ConditionExpressionAggregator,
    InputCondition,
} from "./condition.models"

export function aggregateInputCondition(
    conditions: InputCondition[],
    aggregatorOperator?: ConditionExpressionAggregator,
): InputCondition {
    if (conditions.length <= 0 || !isPresent(aggregatorOperator)) return {}

    return conditions.reduce((prev, curr) => {
        const newCondition: InputCondition = {
            ConditionExpression: `(${prev.ConditionExpression}) ${aggregatorOperator} (${curr.ConditionExpression})`,
            ExpressionAttributeNames: mergeRecords(
                prev.ExpressionAttributeNames,
                curr.ExpressionAttributeNames,
            ),
            ExpressionAttributeValues: mergeRecords(
                prev.ExpressionAttributeValues,
                curr.ExpressionAttributeValues,
            ),
        }

        return newCondition
    })
}
