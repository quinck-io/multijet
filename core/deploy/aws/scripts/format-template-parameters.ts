import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'

const [jsonParametersFilePath, formattedParametersFilePath] =
    process.argv.slice(2)

const EQUALS = '='

function parseValue(value: unknown): unknown {
    const numberValue = Number(value)
    if (!isNaN(numberValue)) return numberValue
    if (typeof value === 'string') return `"${value}"`
    return value
}

const parameters: Record<string, unknown> = JSON.parse(
    readFileSync(jsonParametersFilePath).toString(),
)

const formattedParameters = Object.entries(parameters)
    .map(([key, value]) => `${key}${EQUALS}${parseValue(value)}`)
    .join(' ')

mkdirSync(dirname(formattedParametersFilePath), { recursive: true })

writeFileSync(formattedParametersFilePath, formattedParameters)
