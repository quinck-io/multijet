import { createS3MediaStorageService } from './s3/factory'
import { MediaStorageService } from './models'

export type MediaStorageServiceParams = {
    name: string
    baseDirectory?: string
}

export type MediaStorageServiceFactory = (
    params: MediaStorageServiceParams,
) => MediaStorageService

export const createMediaStorageService: MediaStorageServiceFactory = params =>
    createS3MediaStorageService(params)
