import { cpSync, readFileSync, writeFileSync } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yaml'
import {
    FILE_BLACKLIST,
    LIB,
    MICROSERVICE,
    OPTIONAL_MODULES,
} from './consts.js'
import { addScriptToPackage } from './helper.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const optionalDir = path.join(__dirname, '..', 'optional')
const optionalModulesDir = path.join(__dirname, '..', '..', 'modules')

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
    if (optionalModuleCodes.includes('auth')) {
        scaffoldModule(projectDir, 'user-service', MICROSERVICE)
        scaffoldModule(projectDir, 'user-manager', LIB)
    }
}

function scaffoldModule(projectDir, moduleName, type) {
    const workspace = type === LIB ? 'libs' : 'microservices'
    const sourceDir = path.join(optionalModulesDir, workspace)
    const targetDir = path.join(projectDir, workspace)

    cpSync(path.join(sourceDir, moduleName), path.join(targetDir, moduleName), {
        recursive: true,
        filter: file => !FILE_BLACKLIST.includes(path.basename(file)),
    })
}

function scaffoldOptionalLibs(projectDir, optionalModules) {
    const selectedLibs = optionalModules.filter(
        module => module.type && module.type === LIB,
    )
    selectedLibs.forEach(({ code: libName }) => {
        scaffoldModule(projectDir, libName, LIB)
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
    scaffoldModule(projectDir, PRISMA_LIB_NAME, LIB)
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
