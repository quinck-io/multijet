export enum AcceptHeader {
    JSON = 'application/json',
}

export type BufferedDataMappers<X, Y = unknown> = Map<AcceptHeader, (i: X) => Y>
