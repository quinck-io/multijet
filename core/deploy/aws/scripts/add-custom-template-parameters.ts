import { readFileSync, writeFileSync } from 'fs'

const args = process.argv.slice(2)
const [jsonParametersFilePath] = args
const templateParametersToBeAdded = args.slice(1)

const EQUALS = '='

const newParameters = templateParametersToBeAdded.reduce(
    (newParameters, parameter) => {
        const [key, value] = parameter.split(EQUALS)
        newParameters[key] = value
        return newParameters
    },
    {} as Record<string, unknown>,
)

const parameters: Record<string, unknown> = JSON.parse(
    readFileSync(jsonParametersFilePath).toString(),
)

const resultingParameters: Record<string, unknown> = {
    ...parameters,
    ...newParameters,
}

writeFileSync(
    jsonParametersFilePath,
    JSON.stringify(resultingParameters, null, 4),
)
