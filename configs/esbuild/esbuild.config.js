/* eslint-disable */

const { build } = require('esbuild')

build({
    entryPoints: ['src/lambda.ts'],
    outfile: 'dist/lambda.js',
    bundle: true,
    platform: 'node',
    logLevel: 'info',
}).catch(() => process.exit(1))
