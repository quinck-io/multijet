import { MediaStorageServiceFactory } from '../factory'
import { S3MediaStorageService } from './s3-storage'

export const createS3MediaStorageService: MediaStorageServiceFactory = params =>
    new S3MediaStorageService(params)
