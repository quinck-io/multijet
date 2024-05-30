import { createApp } from "./app"

async function bootstrap() {
    const app = await createApp()

    await app.listen({ port: 3000, host: "0.0.0.0" })
}

bootstrap()
