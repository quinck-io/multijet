import chai from 'chai'
import chaiPromise from 'chai-as-promised'
import 'mocha'
import { createMediaStorageService } from '../src/factory'
import { MOCK_MEDIA_STORAGE_BASE_DIR, MOCK_MEDIA_STORAGE_NAME } from './mock'

chai.use(chaiPromise)

const { expect } = chai

describe('createMediaStorageService', () => {
    it('should not create a null media storage service', async () => {
        const mediaStorage = createMediaStorageService({
            name: MOCK_MEDIA_STORAGE_NAME,
        })
        expect(mediaStorage).to.not.be.null
    })

    it('should not create an undefined media storage service', async () => {
        const mediaStorage = createMediaStorageService({
            name: MOCK_MEDIA_STORAGE_NAME,
        })
        expect(mediaStorage).to.not.be.undefined
    })

    it('should allow to create a media storage service', async () => {
        expect(
            createMediaStorageService.bind(createMediaStorageService, {
                name: MOCK_MEDIA_STORAGE_NAME,
            }),
        ).to.not.throw()
    })

    it('should allow to create a media storage service with a base directory', async () => {
        expect(
            createMediaStorageService.bind(createMediaStorageService, {
                name: MOCK_MEDIA_STORAGE_NAME,
                baseDirectory: MOCK_MEDIA_STORAGE_BASE_DIR,
            }),
        ).to.not.throw()
    })
})
