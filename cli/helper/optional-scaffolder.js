import { cpSync, readFileSync, writeFileSync } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yaml'
import { FILE_BLACKLIST, OPTIONAL_MODULES } from './consts.js'
import { addScriptToPackage } from './helper.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const optionalDir = path.join(__dirname, '..', 'optional')
const optionalModulesDir = path.join(__dirname, '..', '..', 'modules')

/**
 * Apply optional modules to the project.
 *
 * @param {string} projectName - The name of the project.
 * @param {string} projectDir - The directory of the project.
 * @param {import('../types').OptionalModule[]} selectedModules
 * @returns {Promise<void>}
 */
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
        scaffoldModule(projectDir, 'user-service', 'MICROSERVICE')
        scaffoldModule(projectDir, 'user-manager', 'LIB')
    }
}

/**
 * Scaffold a module in the project.
 *
 * @param {string} projectDir - The directory of the project.
 * @param {string} moduleName - The name of the module to scaffold.
 * @param {"LIB" | "MICROSERVICE"} type - The type of the module
 */
function scaffoldModule(projectDir, moduleName, type) {
    const workspace = type === 'LIB' ? 'libs' : 'microservices'
    const sourceDir = path.join(optionalModulesDir, workspace)
    const targetDir = path.join(projectDir, workspace)

    cpSync(path.join(sourceDir, moduleName), path.join(targetDir, moduleName), {
        recursive: true,
        filter: file => !FILE_BLACKLIST.includes(path.basename(file)),
    })
}

/**
 * Scaffold optional libraries in the project.
 *
 * @param {string} projectDir - The directory of the project.
 * @param {import('../types').OptionalModule[]} optionalModules
 */
function scaffoldOptionalLibs(projectDir, optionalModules) {
    const selectedLibs = optionalModules.filter(
        module => module.type && module.type === 'LIB',
    )
    selectedLibs.forEach(({ code: libName }) => {
        scaffoldModule(projectDir, libName, 'LIB')
    })
}

/**
 * Scaffold Prisma files in the project.
 *
 * @param {string} projectDir - The directory of the project.
 */
function scaffoldPrismaFiles(projectDir) {
    const prismaDir = path.join(optionalDir, 'prisma')
    const PRISMA_LIB_NAME = 'prisma-utils'
    const PRISMA_SCRIPT = 'npm run prisma -w @libs/prisma-utils'

    copyRootFiles(projectDir, prismaDir, true)
    cpSync(path.join(prismaDir, 'configs'), path.join(projectDir, 'configs'), {
        recursive: true,
        force: true,
    })
    scaffoldModule(projectDir, PRISMA_LIB_NAME, 'LIB')
    addScriptToPackage(projectDir, 'prisma', PRISMA_SCRIPT)
}

/**
 * Scaffold pipeline files in the project.
 *
 * @param {string} projectName - The name of the project.
 * @param {string} projectDir - The directory of the project.
 */
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

/**
 * Copy root files to the project directory.
 *
 * @param {string} projectDir - The directory of the project.
 * @param {string} optionalDir - The directory containing optional files.
 * @param {boolean} force - Whether to force copying the files.
 */
function copyRootFiles(projectDir, optionalDir, force = false) {
    cpSync(path.join(optionalDir, 'root'), projectDir, {
        recursive: true,
        force,
    })
}
