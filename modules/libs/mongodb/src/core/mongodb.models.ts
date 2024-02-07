import { Db } from "mongodb"

export type MongodbParams = {
    uri: string
    database?: string
}

export type MongodbStorageParams = {
    mongodb: Db
}
