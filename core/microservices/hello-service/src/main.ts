import { Components, setupModuleContainer } from './utils/components'

async function bootstrap() {
    const container = setupModuleContainer()

    const createApp = container.resolve(Components.createApp)

    const app = createApp()

    await app.listen({ port: 3000, host: '0.0.0.0' })
}

bootstrap()
