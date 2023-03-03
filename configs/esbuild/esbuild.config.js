/* eslint-disable */

const { build } = require('esbuild')
const { yamlPlugin } = require('esbuild-plugin-yaml')

build({
    entryPoints: ['src/lambda.ts'],
    outfile: 'dist/lambda.js',
    plugins: [yamlPlugin()],
    bundle: true,
    platform: 'node',
    logLevel: 'info',
}).catch(() => process.exit(1))
