import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    ListObjectsV2CommandInput,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import "@quinck/collections"
import { isPresent } from "@quinck/type-utils"
import { Readable } from "stream"
import { MediaStorageServiceParams } from "../factory"
import {
    FileInformation,
    MediaStorageService,
    SearchFileParams,
} from "../models"
import { readableToBuffer } from "../utils"

const URL_EXPIRES_SECONDS = 60 * 60 * 24 * 7
const SLASH = "/"

export class S3MediaStorageService implements MediaStorageService {
    private readonly bucketName: string
    private readonly baseDirectory?: string
    private readonly storage: S3Client

    constructor({ name, baseDirectory }: MediaStorageServiceParams) {
        this.bucketName = name
        if (baseDirectory) this.baseDirectory = baseDirectory
        this.storage = new S3Client({})
    }

    public async storeFile(
        filePath: string,
        content: Buffer,
    ): Promise<FileInformation> {
        const Key = this.getKey(filePath)
        const uploadCommand = new PutObjectCommand({
            Bucket: this.bucketName,
            Key,
            Body: content,
        })
        await this.storage.send(uploadCommand)

        return this.getFileInformation(filePath)
    }

    public async getFileInformation(
        filePath: string,
    ): Promise<FileInformation> {
        const Key = this.getKey(filePath)
        return this._getFileInformation(Key)
    }

    private async _getFileInformation(Key: string): Promise<FileInformation> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key,
        })
        const url = await getSignedUrl(this.storage, command, {
            expiresIn: URL_EXPIRES_SECONDS,
        })
        return { filePath: Key, url }
    }

    public async deleteFile(filePath: string): Promise<void> {
        const Key = this.getKey(filePath)
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key,
        })
        await this.storage.send(command)
    }

    public searchFiles({
        prefix,
    }: SearchFileParams): Promise<FileInformation[]> {
        return this.S3SearchFiles({
            Bucket: this.bucketName,
            Prefix: prefix ? this.getKey(prefix) : this.baseDirectory,
        })
    }

    private async S3SearchFiles(
        request: ListObjectsV2CommandInput,
        currentItems: FileInformation[] = [],
    ): Promise<FileInformation[]> {
        const command = new ListObjectsV2Command(request)
        const { Contents, IsTruncated, NextContinuationToken } =
            await this.storage.send(command)
        const newItems = (Contents || []).singleCollect(
            k => isPresent(k.Key),
            v => this._getFileInformation(v.Key as string),
        )
        const items = currentItems.concat(await Promise.all(newItems))
        if (IsTruncated === true)
            return this.S3SearchFiles(
                { ...request, ContinuationToken: NextContinuationToken },
                items,
            )
        else return items
    }

    public async getFileContent(filePath: string): Promise<Buffer> {
        const client = new S3Client({})
        const getObjectCommand = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: this.getKey(filePath),
        })
        const { Body } = await client.send(getObjectCommand)
        if (!Body) throw new Error()
        return readableToBuffer(Body as Readable)
    }

    public async copy(
        sourcePath: string,
        destinationPath: string,
    ): Promise<void> {
        const client = new S3Client({})
        const command = new CopyObjectCommand({
            Bucket: this.bucketName,
            CopySource: [this.bucketName, this.getKey(sourcePath)].join(SLASH),
            Key: this.getKey(destinationPath),
        })
        await client.send(command)
    }

    private getKey(filePath: string): string {
        if (this.baseDirectory)
            return [this.baseDirectory, filePath].join(SLASH)
        else return filePath
    }
}
