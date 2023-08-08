export const FILE_BLACKLIST = ['.aws-sam', 'node_modules', 'dist', '.turbo']

/**
 * @type {import('../types').OptionalModule[]} OPTIONAL_MODULES
 * @constant
 */
export const OPTIONAL_MODULES = [
    { name: 'User authentication', code: 'auth', type: 'OTHER' },
    { name: 'Notifications', code: 'notifications-manager', type: 'LIB' },
    { name: 'Payments', code: 'payments', type: 'LIB' },
    { name: 'E2E Tests', code: 'e2e', type: 'OTHER' },
    { name: 'DynamoDB utilities', code: 'dynamoose-utils', type: 'LIB' },
    { name: 'Prisma ORM', code: 'prisma', type: 'OTHER' },
    { name: 'Media storage', code: 'media-storage', type: 'LIB' },
]
