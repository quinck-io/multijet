import { PrismaClient } from '@prisma/client'

export function createPrismaClient(databaseUrl: string): PrismaClient {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl,
            },
        },
    })
    return prisma
}

export * from '@prisma/client'
