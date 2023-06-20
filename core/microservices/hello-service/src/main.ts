import { appContainer } from './di-container'

async function bootstrap() {
    const container = appContainer()

    const createApp = container.resolve('createApp')

    const app = createApp()

    await app.listen({ port: 3000, host: '0.0.0.0' })
}

bootstrap()
