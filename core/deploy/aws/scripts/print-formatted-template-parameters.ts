import { readFileSync } from 'fs'

const [jsonParametersFilePath] = process.argv.slice(2)

const EQUALS = '='

const parameters: Record<string, unknown> = JSON.parse(
    readFileSync(jsonParametersFilePath).toString(),
)

const formattedParameters = Object.entries(parameters)
    .map(([key, value]) => `${key}${EQUALS}${value}`)
    .join(' ')

console.log(formattedParameters)
