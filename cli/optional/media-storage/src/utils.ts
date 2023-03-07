import { Readable } from 'stream'

export function readableToBuffer(readable: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const bufferItems: Uint8Array[] = []
        readable.on('data', chunk => bufferItems.push(chunk))
        readable.on('end', () => resolve(Buffer.concat(bufferItems)))
        readable.on('error', error => reject(error))
    })
}
