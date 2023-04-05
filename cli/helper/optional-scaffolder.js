import { cpSync, readFileSync, writeFileSync } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yaml'
import { FILE_BLACKLIST, LIB, OPTIONAL_MODULES } from './consts.js'
import { addScriptToPackage } from './helper.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const optionalDir = path.join(__dirname, '..', 'optional')

export async function applyOptionalModules(
    projectName,
    projectDir,
    selectedModules,
) {
    const optionalModules = OPTIONAL_MODULES.filter(module =>
        selectedModules.includes(module.name),
    ).map(module => ({
        code: module.code,
        type: module.type,
    }))

    const optionalModuleCodes = optionalModules.map(module => module.code)

    scaffoldOptionalLibs(projectDir, optionalModules)

    if (optionalModuleCodes.includes('pipeline'))
        scaffoldPipelineFiles(projectName, projectDir)
    if (optionalModuleCodes.includes('prisma')) scaffoldPrismaFiles(projectDir)
}

function scaffoldOptionalLibs(projectDir, optionalModules) {
    const libsDir = path.join(projectDir, 'libs')

    const selectedLibs = optionalModules.filter(
        module => module.type && module.type === LIB,
    )

    selectedLibs.forEach(({ code: libName }) => {
        cpSync(path.join(optionalDir, libName), path.join(libsDir, libName), {
            recursive: true,
            filter: file => !FILE_BLACKLIST.includes(path.basename(file)),
        })
    })
}

function scaffoldPrismaFiles(projectDir) {
    const prismaDir = path.join(optionalDir, 'prisma')
    const PRISMA_LIB_NAME = 'prisma-utils'
    const PRISMA_SCRIPT = 'npm run prisma -w @libs/prisma-utils'

    copyRootFiles(projectDir, prismaDir, true)
    cpSync(path.join(prismaDir, 'configs'), path.join(projectDir, 'configs'), {
        recursive: true,
        force: true,
    })
    cpSync(
        path.join(prismaDir, PRISMA_LIB_NAME),
        path.join(projectDir, 'libs', PRISMA_LIB_NAME),
        {
            recursive: true,
            filter: file => !FILE_BLACKLIST.includes(path.basename(file)),
        },
    )
    addScriptToPackage(projectDir, 'prisma', PRISMA_SCRIPT)
}

function scaffoldPipelineFiles(projectName, projectDir) {
    const pipelineDir = path.join(optionalDir, 'pipeline')

    copyRootFiles(projectDir, pipelineDir)
    cpSync(
        path.join(pipelineDir, 'configs'),
        path.join(projectDir, 'configs', 'pipeline'),
        { recursive: true, force: false },
    )

    const projectConfigPath = path.join(projectDir, 'project.configs.yml')
    const projectConfigFile = readFileSync(projectConfigPath, {
        encoding: 'utf-8',
    })
    const newProjectConfig = YAML.parse(projectConfigFile)
    newProjectConfig.projectName = projectName
    newProjectConfig.aws.codebuildProjectName = projectName

    writeFileSync(projectConfigPath, YAML.stringify(newProjectConfig, null, 4))
}

function copyRootFiles(projectDir, optionalDir, force = false) {
    cpSync(path.join(optionalDir, 'root'), projectDir, {
        recursive: true,
        force,
    })
}
