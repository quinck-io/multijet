import { Db, MongoClient } from "mongodb"
import { MongodbParams } from "./mongodb.models"

export const DATABASE_NAME = "appdb"

export const mongodb = ({ uri, database }: MongodbParams): Db =>
    new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
    }).db(database ?? DATABASE_NAME)
