import { Paginated } from '@libs/models'
import { FastifyReply, FastifyRequest } from 'fastify'
import { defaultPaginatedMappers } from './mappers/defaults'
import { AcceptHeader, BufferedDataMappers } from './mappers/models'
import {
    ContentResponse,
    GetPaginatedResultParams,
    PaginatedQuery,
    PaginatedResultOption,
    TypedPaginated,
} from './models'

export type HttpParams<X> = {
    data: X
    request: FastifyRequest
    reply: FastifyReply
}

export function createContentResponse<X>(
    params: HttpParams<X>,
    bufferedDataMappers: BufferedDataMappers<X> = new Map(),
): ContentResponse<X | Buffer | string> {
    const { data, reply } = params
    reply.header('Content-Type', AcceptHeader.JSON)
    reply.serializer(payload =>
        JSON.stringify(
            mapDataForBuffer(bufferedDataMappers, payload, AcceptHeader.JSON),
        ),
    )
    return { contentType: AcceptHeader.JSON, data }
}

export function mapDataForBuffer<X>(
    bufferedDataMappers: Map<AcceptHeader, (i: X) => unknown>,
    data: X,
    acceptHeader: AcceptHeader,
): X | unknown {
    const mapper = bufferedDataMappers.get(acceptHeader)
    return mapper ? mapper(data) : data
}

export function getPaginatedResult<Item extends Paginated['items']>(
    params: GetPaginatedResultParams<Item>,
    bufferedDataMappers?: BufferedDataMappers<Paginated>,
): PaginatedResultOption {
    const { items, limit, offset, reply, request } = params
    const data: Paginated = {
        numberOfItems: items.length,
        items,
    }

    const paginatedMappers =
        bufferedDataMappers || defaultPaginatedMappers(offset, limit)

    const contentResponse = createContentResponse(
        { data, request, reply },
        paginatedMappers,
    )
    return contentResponse.data
}

export async function paginateJSONResult<Item, ResultItem>(
    request: FastifyRequest,
    items: Item[],
    postResizeMapper: (item: Item) => Promise<ResultItem>,
): Promise<TypedPaginated<ResultItem>> {
    const { limit, offset } = request.query as PaginatedQuery

    const numberOfItems = items.length

    const followersPromises = items
        .slice(offset, offset + limit)
        .map(postResizeMapper)

    const followers = await Promise.all(followersPromises)

    return {
        numberOfItems,
        items: followers,
    }
}
