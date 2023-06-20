import { buildApp } from './app'
import { createAppComponents } from './utils/components'

async function bootstrap() {
    const app = buildApp(createAppComponents())
    await app.listen({ port: 3000, host: '0.0.0.0' })
}

bootstrap()
