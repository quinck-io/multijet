import { DeepPartial, ModelType } from 'dynamoose/dist/General'
import { Item } from 'dynamoose/dist/Item'
import { Schema } from 'dynamoose/dist/Schema'
import { TableOptions } from 'dynamoose/dist/Table'
import { dynamoose } from '../dynamoose.helper'

export function createSimpleModel<
    Model extends object,
    ModelItem extends Model & Item = Model & Item,
>(
    tableName: string,
    schema: Schema,
    tableOptions: DeepPartial<TableOptions> = { create: false },
): ModelType<ModelItem> {
    return dynamoose.model<ModelItem>(tableName, schema, tableOptions)
}
