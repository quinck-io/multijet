import { Paginated } from '../generated/openapi'
import { FastifyReply, FastifyRequest } from 'fastify'

export type TypedPaginated<X> = Omit<Paginated, 'items'> & {
    items: X[]
}

export type PaginatedQuery = {
    limit: number
    offset: number
}

export type ContentResponse<X> = {
    contentType: string
    data: X
}

export type ExtendedPaginatedResult<X> = X & Paginated
export type PaginatedResultOption<X = unknown> =
    | Paginated
    | ExtendedPaginatedResult<X>
    | Buffer
    | string

export type GetPaginatedResultParams<Item> = {
    items: Item[]
    offset: number
    limit: number
    request: FastifyRequest
    reply: FastifyReply
}

export type GetSearchResultParams<Item> = {
    items: Item[]
    request: FastifyRequest
    reply: FastifyReply
}

export type SearchResult<Item> = Item[]
export type SearchResultOption<Item> = SearchResult<Item> | Buffer | string
