import { RecursiveKeyOf, StringKeyOf } from '@libs/utils'
import { Schema, SchemaDefinition } from 'dynamoose/dist/Schema'

export type TypedSchemaSettings = NonNullable<
    ConstructorParameters<typeof Schema>[1]
>

export type SchemaDefinitionValue = SchemaDefinition['*']

export type SaveUnknown<Model extends object> =
    | TypedSchemaSettings['saveUnknown']
    | (
          | `${RecursiveKeyOf<Model>}`
          | `${RecursiveKeyOf<Model>}.*`
          | `${RecursiveKeyOf<Model>}.**`
      )[]

export type ModelSchemaSettings<Model extends object> = Omit<
    TypedSchemaSettings,
    'saveUnknown'
> & {
    saveUnknown: SaveUnknown<Model>
}

export type ModelSchemaDefinition<Model extends object> = Record<
    StringKeyOf<Model>,
    SchemaDefinitionValue
>

export function createSchema<Model extends object>(
    definition: ModelSchemaDefinition<Model>,
    settings?: ModelSchemaSettings<Model>,
): Schema {
    return new Schema(definition, settings)
}
