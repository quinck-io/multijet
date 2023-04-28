import { DynamoDB, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
    BatchGetItemCommandInput,
    BatchGetItemCommandOutput,
} from '@aws-sdk/client-dynamodb/dist-types/commands/BatchGetItemCommand'
import {
    BatchWriteItemCommandInput,
    BatchWriteItemCommandOutput,
} from '@aws-sdk/client-dynamodb/dist-types/commands/BatchWriteItemCommand'
import {
    DeleteItemCommandInput,
    DeleteItemCommandOutput,
} from '@aws-sdk/client-dynamodb/dist-types/commands/DeleteItemCommand'
import {
    GetItemCommandInput,
    GetItemCommandOutput,
} from '@aws-sdk/client-dynamodb/dist-types/commands/GetItemCommand'
import {
    PutItemCommandInput,
    PutItemCommandOutput,
} from '@aws-sdk/client-dynamodb/dist-types/commands/PutItemCommand'
import {
    TransactGetItemsCommandInput,
    TransactGetItemsCommandOutput,
} from '@aws-sdk/client-dynamodb/dist-types/commands/TransactGetItemsCommand'
import {
    TransactWriteItemsCommandInput,
    TransactWriteItemsCommandOutput,
} from '@aws-sdk/client-dynamodb/dist-types/commands/TransactWriteItemsCommand'
import {
    UpdateItemCommandInput,
    UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb/dist-types/commands/UpdateItemCommand'

export type DynamoDBItemCommandInput =
    | PutItemCommandInput
    | UpdateItemCommandInput
    | GetItemCommandInput
    | DeleteItemCommandInput

export type DynamoDBCommandInput =
    | DynamoDBItemCommandInput
    | BatchGetItemCommandInput
    | BatchWriteItemCommandInput
    | TransactGetItemsCommandInput
    | TransactWriteItemsCommandInput

export type DynamoDBhandlerOptions =
    | Parameters<DynamoDB['putItem']>['1']
    | Parameters<DynamoDB['updateItem']>['1']
    | Parameters<DynamoDB['getItem']>['1']
    | Parameters<DynamoDB['deleteItem']>['1']
    | Parameters<DynamoDB['batchGetItem']>['1']
    | Parameters<DynamoDB['batchWriteItem']>['1']
    | Parameters<DynamoDB['transactWriteItems']>['1']

export type DynamoDBItemCommandOutput =
    | PutItemCommandOutput
    | UpdateItemCommandOutput
    | GetItemCommandOutput
    | DeleteItemCommandOutput

export type DynamoDBCommandOutput =
    | DynamoDBItemCommandOutput
    | BatchGetItemCommandOutput
    | BatchWriteItemCommandOutput
    | TransactGetItemsCommandOutput
    | TransactWriteItemsCommandOutput

export type SendCommandInput = Parameters<DynamoDBClient['send']>['0']
export type SendHandlerOptions = Parameters<DynamoDBClient['send']>['1']
export type SendCommandOutput = Awaited<ReturnType<DynamoDBClient['send']>>

export type CommandInput = SendCommandInput | DynamoDBCommandInput
export type HandlerOptions = SendHandlerOptions | DynamoDBhandlerOptions
export type CommandOutput = DynamoDBCommandOutput
