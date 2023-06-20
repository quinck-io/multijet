import awsLambdaFastify from '@fastify/aws-lambda'
import { Components, setupModuleContainer } from './utils/components'

const container = setupModuleContainer()
const createApp = container.resolve(Components.createApp)

const app = createApp()
const proxy = awsLambdaFastify(app)
export const handler = proxy
