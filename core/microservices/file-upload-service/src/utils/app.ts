import { Handlers } from '@libs/fastify-utils'
import { FileUploadController } from '../file-upload/file-upload.controller'

export interface AppComponents {
    message: string
}

export function createAppComponents(): AppComponents {
    return { message: 'world' }
}

export function createHandlers(components: AppComponents): Handlers {
    const fileUploadController = new FileUploadController(components.message)

    return {
        uploadFile: fileUploadController.uploadFileHandler,
    }
}
