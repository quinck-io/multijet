import { ModelType } from "dynamoose/dist/General"
import { Item } from "dynamoose/dist/Item"

export type AsItem<Model extends object> = Model & Item
export type PlainModelType<Model extends object> = ModelType<AsItem<Model>>
