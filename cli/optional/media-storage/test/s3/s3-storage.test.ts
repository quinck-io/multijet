import {
    DeleteObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import chai from 'chai'
import chaiPromise from 'chai-as-promised'
import 'mocha'
import { Readable } from 'stream'
import { S3MediaStorageService } from '../../src/s3/s3-storage'
import {
    MOCK_FILE_CONTENT,
    MOCK_FILE_PATH,
    MOCK_KEY,
    MOCK_KEY_WITH_BASE_DIR,
    MOCK_MEDIA_STORAGE_BASE_DIR,
    MOCK_MEDIA_STORAGE_NAME,
} from '../mock'

// Set aws sdk configuration for tests
process.env.AWS_REGION = 'eu-west-1'
process.env.AWS_ACCESS_KEY_ID = 'mock'
process.env.AWS_SECRET_ACCESS_KEY = 'mock'

chai.use(chaiPromise)

const { expect } = chai

const s3MediaStorage = (baseDirectory?: string) =>
    new S3MediaStorageService({
        name: MOCK_MEDIA_STORAGE_NAME,
        baseDirectory,
    })

function assertFileUrlIsValid(fileUrl: string, filePath: string): void {
    const prefix = `https://s3.eu-west-1.amazonaws.com/${MOCK_MEDIA_STORAGE_NAME}/${filePath}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD`
    const toBeIncludedProperties = [
        'X-Amz-Credential',
        'X-Amz-Date',
        'X-Amz-Signature',
        'X-Amz-SignedHeaders',
        'x-id=GetObject',
    ]

    const isValid =
        fileUrl.startsWith(prefix) &&
        toBeIncludedProperties.every(prop => fileUrl.includes(prop))

    expect(isValid).to.be.true
}

const s3Mock = mockClient(S3Client)

describe('S3MediaStorageService', () => {
    describe('when asked to store a file', () => {
        beforeEach(() => s3Mock.reset())

        it('should allow to store a file', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(PutObjectCommand).resolves({})
            const promise = storage.storeFile(MOCK_FILE_PATH, MOCK_FILE_CONTENT)
            await expect(promise).to.be.eventually.fulfilled
        })

        it('send the correct parameters to the s3 client', async () => {
            const storage = s3MediaStorage()
            s3Mock
                .on(
                    PutObjectCommand,
                    {
                        Bucket: MOCK_MEDIA_STORAGE_NAME,
                        Key: MOCK_KEY,
                        Body: MOCK_FILE_CONTENT,
                    },
                    true,
                )
                .resolves({})
            const promise = storage.storeFile(MOCK_FILE_PATH, MOCK_FILE_CONTENT)
            await expect(promise).to.be.eventually.fulfilled
        })

        it('should reply with the correct file path', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(PutObjectCommand).resolves({})
            const result = await storage.storeFile(
                MOCK_FILE_PATH,
                MOCK_FILE_CONTENT,
            )
            expect(result.filePath).to.be.equal(MOCK_FILE_PATH)
        })

        it('should reply with the correct file url', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(PutObjectCommand).resolves({})
            const { filePath, url } = await storage.storeFile(
                MOCK_FILE_PATH,
                MOCK_FILE_CONTENT,
            )
            assertFileUrlIsValid(url, filePath)
        })

        it('should throws an error if the s3 client throws an error', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(PutObjectCommand).rejects(new Error())
            const promise = storage.storeFile(MOCK_FILE_PATH, MOCK_FILE_CONTENT)
            await expect(promise).to.be.eventually.rejected
        })
    })

    describe('when asked to get the information of a file', () => {
        it('should allow to get the information of the file', async () => {
            const storage = s3MediaStorage()
            const promise = storage.getFileInformation(MOCK_FILE_PATH)
            await expect(promise).to.be.eventually.fulfilled
        })

        it('should reply with the correct file path', async () => {
            const storage = s3MediaStorage()
            const result = await storage.getFileInformation(MOCK_FILE_PATH)
            expect(result.filePath).to.be.equal(MOCK_FILE_PATH)
        })

        it('should reply with the correct file url', async () => {
            const storage = s3MediaStorage()
            const { filePath, url } = await storage.getFileInformation(
                MOCK_FILE_PATH,
            )
            assertFileUrlIsValid(url, filePath)
        })
    })

    describe('when asked to get the content of a file', () => {
        beforeEach(() => s3Mock.reset())

        it('should allow to get the content of the file', async () => {
            const storage = s3MediaStorage()
            s3Mock
                .on(GetObjectCommand)
                .resolves({ Body: Readable.from(MOCK_FILE_CONTENT) })
            const promise = storage.getFileContent(MOCK_FILE_PATH)
            await expect(promise).to.be.eventually.fulfilled
        })

        it('send the correct parameters to the s3 client', async () => {
            const storage = s3MediaStorage()
            s3Mock
                .on(
                    GetObjectCommand,
                    {
                        Bucket: MOCK_MEDIA_STORAGE_NAME,
                        Key: MOCK_KEY,
                    },
                    true,
                )
                .resolves({ Body: Readable.from(MOCK_FILE_CONTENT) })
            const promise = storage.getFileContent(MOCK_FILE_PATH)
            await expect(promise).to.be.eventually.fulfilled
        })

        it('should reply with the correct file content', async () => {
            const storage = s3MediaStorage()
            s3Mock
                .on(GetObjectCommand)
                .resolves({ Body: Readable.from(MOCK_FILE_CONTENT) })
            const content = await storage.getFileContent(MOCK_FILE_PATH)

            expect(content.toString()).to.be.equal(MOCK_FILE_CONTENT.toString())
        })

        it('should throws an error if the file content was not retrieved by the s3 client', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(GetObjectCommand).resolves({})
            const promise = storage.getFileContent(MOCK_FILE_PATH)
            await expect(promise).to.be.eventually.rejected
        })

        it('should throws an error if the s3 client throws an error', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(GetObjectCommand).rejects(new Error())
            const promise = storage.getFileContent(MOCK_FILE_PATH)
            await expect(promise).to.be.eventually.rejected
        })
    })

    describe('when asked to delete a file', () => {
        beforeEach(() => s3Mock.reset())

        it('should allow to delete a file', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(DeleteObjectCommand).resolves({})
            const promise = storage.deleteFile(MOCK_FILE_PATH)
            await expect(promise).to.be.eventually.fulfilled
        })

        it('send the correct parameters to the s3 client', async () => {
            const storage = s3MediaStorage()
            s3Mock
                .on(
                    DeleteObjectCommand,
                    {
                        Bucket: MOCK_MEDIA_STORAGE_NAME,
                        Key: MOCK_KEY,
                    },
                    true,
                )
                .resolves({})
            const promise = storage.deleteFile(MOCK_FILE_PATH)
            await expect(promise).to.be.eventually.fulfilled
        })

        it('should allow to delete a file even if a baseDirectory is set', async () => {
            const storage = s3MediaStorage(MOCK_MEDIA_STORAGE_BASE_DIR)
            s3Mock.on(DeleteObjectCommand).rejects(new Error())
            const promise = storage.deleteFile(MOCK_FILE_PATH)
            await expect(promise).to.be.eventually.rejected
        })

        it('should throws an error if the s3 client throws an error', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(DeleteObjectCommand).rejects(new Error())
            const promise = storage.deleteFile(MOCK_FILE_PATH)
            await expect(promise).to.be.eventually.rejected
        })
    })

    describe('when asked to search files', () => {
        beforeEach(() => s3Mock.reset())

        const response = {
            Contents: [
                {
                    Key: MOCK_KEY,
                },
                {
                    Key: MOCK_KEY_WITH_BASE_DIR,
                },
            ],
        }

        const expected = response.Contents.map(x => x.Key)

        it('should allow to search files', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(ListObjectsV2Command).resolves(response)
            const promise = storage.searchFiles({})
            await expect(promise).to.be.eventually.fulfilled
        })

        it('send the correct parameters to the s3 client', async () => {
            const storage = s3MediaStorage()
            s3Mock
                .on(
                    ListObjectsV2Command,
                    {
                        Bucket: MOCK_MEDIA_STORAGE_NAME,
                        Prefix: undefined,
                    },
                    true,
                )
                .resolves(response)
            const promise = storage.searchFiles({})
            await expect(promise).to.be.eventually.fulfilled
        })

        it('should reply with the the files found', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(ListObjectsV2Command).resolves(response)
            const files = await storage.searchFiles({})
            const paths = files.map(x => x.filePath)
            expect(paths).to.have.same.members(expected)
        })

        it('should reply with the the files found of all pages', async () => {
            const storage = s3MediaStorage()
            const newKey = 'newPath'
            s3Mock
                .on(ListObjectsV2Command)
                .resolvesOnce({
                    Contents: [{ Key: newKey }],
                    NextContinuationToken: 'MOCK',
                    IsTruncated: true,
                })
                .resolves(response)
            const files = await storage.searchFiles({})
            const paths = files.map(x => x.filePath)
            expect(paths).to.have.same.members([newKey].concat(expected))
        })

        it('should return an empty array if any file was found', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(ListObjectsV2Command).resolves({})
            const files = await storage.searchFiles({})
            expect(files).to.be.empty
        })

        it('should allow to search file specifying a prefix', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(ListObjectsV2Command).resolves({
                Contents: [
                    {
                        Key: MOCK_KEY,
                    },
                ],
            })
            const files = await storage.searchFiles({
                prefix: MOCK_KEY,
            })
            const expected = [MOCK_KEY]
            const paths = files.map(x => x.filePath)
            expect(paths).to.have.same.members(expected)
        })

        it('should throws an error if the s3 client throws an error', async () => {
            const storage = s3MediaStorage()
            s3Mock.on(ListObjectsV2Command).rejects(new Error())
            const promise = storage.searchFiles({})
            await expect(promise).to.be.eventually.rejected
        })
    })
})
