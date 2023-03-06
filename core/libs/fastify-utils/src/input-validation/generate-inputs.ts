import fs from 'fs'
import path from 'path'
import '@quinck/collections'

type OptString = string | undefined
type InputsRaw = [OptString, OptString, OptString, OptString, OptString]
type Inputs = [string, string, string, string, string]
type GroupedInputs = Record<
    string,
    Record<string, Record<string, Record<string, string>>>
>

const filename = 'inputs'
const inputsRawPath = path.join(__dirname, `${filename}.csv`)

const inputsRaw = fs
    .readFileSync(inputsRawPath)
    .toString()
    .split(/\n|\r|\r\n|\n\r/)
    .filter(line => line != undefined && line != null && line != '')
    .slice(1)
    .map(line => line.split(',')) as InputsRaw[]

function arePresents(...items: (unknown | null | undefined)[]): boolean {
    return items.map(isPresent).every(x => x === true)
}

function isPresent(x?: unknown | null) {
    return x != undefined && x != null && x != ''
}

const inputs = inputsRaw
    .singleCollect(
        ([route, method, context, field, inputId]) =>
            arePresents(route, method, context, field, inputId),
        x => x as Inputs,
    )
    .reduce((result, [route, method, context, field, inputId]) => {
        if (!(route in result)) {
            result[route] = {}
        }
        if (!(method in result[route])) {
            result[route][method] = {}
        }
        if (!(context in result[route][method])) {
            result[route][method][context] = {}
        }
        if (!(field in result[route][method][context])) {
            result[route][method][context][field] = inputId
        }
        return result
    }, {} as GroupedInputs)

const inputsPath = path.join(__dirname, `${filename}.json`)

fs.writeFileSync(inputsPath, JSON.stringify(inputs, null, 2))
