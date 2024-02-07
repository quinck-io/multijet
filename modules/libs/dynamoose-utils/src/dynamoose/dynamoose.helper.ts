import { logger } from "@libs/utils"
import dynamooseLib from "dynamoose"

dynamooseLib.logger().then(dynamooseLogger => {
    dynamooseLogger.providers.set(logger)
})

export const dynamoose = dynamooseLib
