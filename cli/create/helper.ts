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

export const copyGihubWorkflows = (
    rootPath: string,
    projectPath: string,
    cicds: string[],
) => {
    const modulesWorkflowsPath = path.join(
        rootPath,
        "modules",
        ".github",
        "workflows",
    )
    const projectWorkflowsPath = path.join(projectPath, ".github", "workflows")

    cicds.forEach(cicd => {
        const cicdPath = path.join(modulesWorkflowsPath, `${cicd}.yaml`)
        cpSync(cicdPath, path.join(projectWorkflowsPath, `${cicd}.yaml`))
    })
}
