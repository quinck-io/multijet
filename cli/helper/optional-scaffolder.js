import { cpSync } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FILE_BLACKLIST, LIB, OPTIONAL_MODULES } from './consts.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function applyOptionalModules(projectDir, selectedModules) {
    const libsDir = path.join(projectDir, 'libs')
    const optionalDir = path.join(__dirname, '..', 'optional')

    const optionalModules = OPTIONAL_MODULES.filter(module =>
        selectedModules.includes(module.name),
    ).map(module => ({
        code: module.code,
        type: module.type,
    }))

    const optionalModuleCodes = optionalModules.map(module => module.code)

    const selectedLibs = optionalModules.filter(
        module => module.type && module.type === LIB,
    )
    selectedLibs.forEach(({ code: libName }) => {
        cpSync(path.join(optionalDir, libName), path.join(libsDir, libName), {
            recursive: true,
            filter: file => !FILE_BLACKLIST.includes(path.basename(file)),
        })
    })

    if (optionalModuleCodes.includes('pipeline')) {
        const pipelineDir = path.join(optionalDir, 'pipeline')

        cpSync(path.join(pipelineDir, 'root'), projectDir, {
            recursive: true,
            force: false,
        })
        cpSync(
            path.join(pipelineDir, 'configs'),
            path.join(projectDir, 'configs', 'pipeline'),
            { recursive: true, force: false },
        )
    }
}
