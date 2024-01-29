import { cpSync, readFileSync, writeFileSync } from "fs"
import path from "path"
import { FILE_BLACKLIST } from "./consts.js"

export function changePackageName(basePath: string, newName: string) {
    const packageJsonPath = path.join(basePath, "package.json")
    const pkgFile = readFileSync(packageJsonPath, {
        encoding: "utf-8",
    })
    const newPkg = { ...JSON.parse(pkgFile), name: newName }
    writeFileSync(packageJsonPath, JSON.stringify(newPkg, null, 4))
}

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
