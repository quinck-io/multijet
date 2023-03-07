import { logger as defaultLogger, Logger } from '@libs/utils'
import dynamooseLib from 'dynamoose'

export const logger: Logger = defaultLogger.extendedChild({})

dynamooseLib.logger().then(dynamooseLogger => {
    dynamooseLogger.providers.set(logger)
})

export const dynamoose = dynamooseLib
