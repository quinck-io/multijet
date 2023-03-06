import { readFileSync, writeFileSync } from 'fs'

const [envFilePath, jsonEnvFilePath] = process.argv.slice(2)

const END_LINE_DELIMITER = /\n|\r/gm
const EQUALS = '='

const env: Record<string, string> = readFileSync(envFilePath)
    .toString()
    .split(END_LINE_DELIMITER)
    .reduce((result, env) => {
        const [key, value] = env.split(EQUALS)
        return {
            ...result,
            [key]: value,
        }
    }, {})

const awsSamCommonEnv = { Parameters: env }
const jsonEnvFormatted = JSON.stringify(awsSamCommonEnv, null, 2)
writeFileSync(jsonEnvFilePath, jsonEnvFormatted)
