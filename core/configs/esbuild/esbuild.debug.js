/* eslint-disable */

const { build } = require('esbuild')

build({
    entryPoints: ['src/main.ts'],
    outfile: 'dist/main.debug.js',
    bundle: true,
    sourcemap: 'inline',
    platform: 'node',
    logLevel: 'info',
}).catch(() => process.exit(1))