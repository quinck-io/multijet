import { Handlers } from "@libs/fastify-utils"

export const getHello: Handlers["getHelloWorld"] = async request => {
    const { message } = request.services
    return { hello: message }
}
