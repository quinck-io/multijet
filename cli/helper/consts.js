export const MICROSERVICE = 'microservice'
export const LIB = 'LIB'
export const OTHER = 'OTHER'

export const FILE_BLACKLIST = ['.aws-sam', 'node_modules', 'dist', '.turbo']

export const OPTIONAL_MODULES = [
    { name: 'Unit Tests', code: 'unit', type: OTHER },
    { name: 'E2E Tests', code: 'e2e', type: OTHER },
    { name: 'User authentication', code: 'auth', type: OTHER },
    { name: 'DynamoDB utilities', code: 'dynamoose-utils', type: LIB },
    { name: 'Prisma ORM', code: 'prisma', type: OTHER },
    { name: 'Media storage', code: 'media-storage', type: LIB },
    { name: 'Jenkins pipeline', code: 'pipeline', type: OTHER },
]
