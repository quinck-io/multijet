import { Db, MongoClient } from "mongodb"

export type MongoClientParams = {
    mongoUri: string
}

export type MongoDatabaseParams = {
    database?: string
}

export const DATABASE_NAME = "sportid-db"

export const mongoClient = ({ mongoUri }: MongoClientParams): MongoClient =>
    new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 })

export const mongodb =
    ({ database }: MongoDatabaseParams = {}) =>
    ({ mongoClient }: { mongoClient: MongoClient }): Db =>
        mongoClient.db(database ?? DATABASE_NAME)
