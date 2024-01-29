import { cpSync } from "fs"
import path from "path"
import { FILE_BLACKLIST } from "./consts.js"

export function copyOptionalLibs(
    rootPath: string,
    projectPath: string,
    libs: string[],
) {
    const optionalLibsPath = path.join(rootPath, "modules", "libs")
    const libsPath = path.join(projectPath, "libs")
    libs.forEach(lib => {
        const libPath = path.join(optionalLibsPath, lib)
        cpSync(libPath, path.join(libsPath, lib), {
            recursive: true,
            filter: file => !FILE_BLACKLIST.includes(path.basename(file)),
        })
    })
}
