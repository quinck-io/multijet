import awsLambdaFastify from "@fastify/aws-lambda"
import { Handler } from "aws-lambda"
import { createApp } from "./app"

export const handler: Handler = async (event, context) => {
    const app = await createApp()

    const proxy = awsLambdaFastify(app, {
        decorateRequest: false,
        callbackWaitsForEmptyEventLoop: false,
    })

    return await proxy(event, context)
}
