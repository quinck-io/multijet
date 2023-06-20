import awsLambdaFastify from '@fastify/aws-lambda'
import { buildApp } from './app'
import { createAppComponents } from './utils/components'

const app = buildApp(createAppComponents())
const proxy = awsLambdaFastify(app)
export const handler = proxy
