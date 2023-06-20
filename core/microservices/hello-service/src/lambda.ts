import awsLambdaFastify from '@fastify/aws-lambda'
import { appContainer } from './di-container'

const container = appContainer()
const createApp = container.resolve('createApp')

const app = createApp()
const proxy = awsLambdaFastify(app)
export const handler = proxy
