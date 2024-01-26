import { Handlers } from "@libs/http"

export const getHello: Handlers["getHelloWorld"] = async request => {
    const { message } = request.services
    return { hello: message }
}
