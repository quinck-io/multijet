import { AcceptHeader, BufferedDataMappers } from './models'

export class BufferedDataMappersBuilder<T> {
    protected bufferedDataMappers: BufferedDataMappers<T>

    private constructor() {
        this.bufferedDataMappers = new Map()
    }

    public static create<T>(): BufferedDataMappersBuilder<T> {
        return new BufferedDataMappersBuilder<T>()
    }

    public set<Y = unknown>(
        accept: AcceptHeader,
        mapper: (i: T) => Y,
    ): BufferedDataMappersBuilder<T> {
        this.bufferedDataMappers.set(accept, mapper)
        return this
    }

    public build(): BufferedDataMappers<T> {
        return this.bufferedDataMappers
    }
}
