export const MICROSERVICE = 'microservice'
export const LIB = 'lib'

export const FILE_BLACKLIST = ['.aws-sam', 'node_modules', 'dist', '.turbo']

export const OPTIONAL_MODULES = [
    { name: 'Unit Tests', code: 'unit' },
    { name: 'E2E Tests', code: 'e2e' },
    { name: 'User authentication', code: 'auth' },
    { name: 'DynamoDB utilities', code: 'dynamoose-utils', type: LIB },
    { name: 'Media storage', code: 'media-storage', type: LIB },
    { name: 'Jenkins pipeline', code: 'jenkins' },
]
