import chai from 'chai'
import chaiPromise from 'chai-as-promised'
import 'mocha'
import { Readable } from 'stream'
import { readableToBuffer } from '../src/utils'

chai.use(chaiPromise)

const { expect } = chai

const MOCK_READABLE_LENGTH = 100
const mockElements = Array.from({ length: MOCK_READABLE_LENGTH }, (_, i) =>
    i.toString(),
)

const createMockReadable = () => {
    const readable = new Readable()
    mockElements.map(elem => readable.push(elem))
    readable.push(null)
    return readable
}

describe('readableToBuffer', () => {
    it('should parse a Readable into a Buffer', async () => {
        const readable = createMockReadable()
        const buffer = await readableToBuffer(readable)
        expect(buffer).to.be.an.instanceOf(Buffer)
    })

    it('should parse a Readable into a Buffer', async () => {
        const readable = createMockReadable()
        const buffer = await readableToBuffer(readable)
        const mockElementsUnified = mockElements.join('')
        expect(buffer.toString()).to.be.equals(mockElementsUnified)
    })

    it('should throw an error if the readable stream emits and error', async () => {
        const readable = createMockReadable()
        const error = new Error()
        const bufferPromise = readableToBuffer(readable)
        expect(bufferPromise).to.eventually.throw(error)
        readable.emit('error', error)
    })
})
