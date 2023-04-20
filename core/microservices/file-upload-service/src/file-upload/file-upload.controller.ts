import { BasicController, Handler } from '@libs/fastify-utils'

export class FileUploadController extends BasicController {
    constructor(private readonly message: string) {
        super(FileUploadController.name)
    }

    public uploadFileHandler: Handler<'uploadFile'> = this.tryDo(
        async request => {
            const multipartData = await request.file()
            const fileBuffer = await multipartData?.toBuffer()

            return {
                filePath: '',
                fileUrl: '',
            }
        },
    )
}
