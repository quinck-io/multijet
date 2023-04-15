/* eslint-disable */

const { build } = require('esbuild')
const { copy } = require('esbuild-plugin-copy')

build({
    entryPoints: ['src/main.ts'],
    outfile: 'dist/main.debug.js',
    bundle: true,
    sourcemap: 'inline',
    platform: 'node',
    logLevel: 'info',
    plugins: [
        copy({
            assets: [
                {
                    from: '../../node_modules/.prisma/client/libquery*',
                    to: '.',
                },
                {
                    from: '../../node_modules/.prisma/client/schema.prisma',
                    to: '.',
                },
            ],
            watch: false,
            verbose: false,
        }),
    ],
}).catch(() => process.exit(1))
