import { cpSync } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FILE_BLACKLIST, LIB, OPTIONAL_MODULES } from './consts.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function applyOptionalModules(projectDir, selectedModules) {
    const libsDir = path.join(projectDir, 'libs')
    const optionalDir = path.join(__dirname, '..', 'optional')

    const selectedLibs = OPTIONAL_MODULES.filter(
        module =>
            selectedModules.includes(module.name) &&
            module.type &&
            module.type === LIB,
    ).map(module => module.code)

    selectedLibs.forEach(lib => {
        cpSync(path.join(optionalDir, lib), path.join(libsDir, lib), {
            recursive: true,
            filter: file => !FILE_BLACKLIST.includes(path.basename(file)),
        })
    })
}
