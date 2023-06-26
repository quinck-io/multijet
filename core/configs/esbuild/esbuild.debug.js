/* eslint-disable */

const { build } = require('esbuild')

const [entryPointArg, outfileArg] = process.argv.slice(2)

const entryPoint = entryPointArg ?? 'main'
const outfile = outfileArg ?? 'main'

build({
    entryPoints: [`src/${entryPoint}.ts`],
    outfile: `dist/${outfile ?? entryPoint}.js`,
    bundle: true,
    sourcemap: 'inline',
    platform: 'node',
    logLevel: 'info',
}).catch(() => process.exit(1))
