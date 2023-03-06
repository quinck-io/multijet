import { Paginated } from '../../generated/openapi'
import { BufferedDataMappersBuilder } from './BufferedDataMappersBuilder'
import { AcceptHeader, BufferedDataMappers } from './models'

export function defaultPaginatedMappers(
    offset: number,
    limit: number,
): BufferedDataMappers<Paginated> {
    return BufferedDataMappersBuilder.create<Paginated>()
        .set(AcceptHeader.JSON, result => ({
            ...result,
            items: result.items.slice(offset, offset + limit),
        }))
        .build()
}
