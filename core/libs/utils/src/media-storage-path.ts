import path from 'path'
import { CUSTOMERS, GATEWAYS, MEDDLE_SAAS, PROJECTS } from './consts'

export enum GatewayConfigFileName {
    INGESTOR_CONFIG = 'ingestion_config.json',
    INGESTOR_SCHEMA = 'ingestion_schema.json',
    COMMUNICATOR_CONFIG = 'communicator_config.json',
}

export function getBaseStoragePath(env: string, customerId: string): string {
    return path.join(MEDDLE_SAAS, env, CUSTOMERS, customerId)
}

export function getProjectStoragePath(
    env: string,
    params: { customerId: string; projectId: string },
): string {
    const { customerId, projectId } = params
    return path.join(getBaseStoragePath(env, customerId), PROJECTS, projectId)
}

export function getGatewayStoragePath(
    env: string,
    params: { customerId: string; projectId: string; gatewayId: string },
): string {
    const { customerId, gatewayId, projectId } = params
    return path.join(
        getProjectStoragePath(env, { customerId, projectId }),
        GATEWAYS,
        gatewayId,
    )
}
