import {
    copyFileSync,
    cpSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    writeFileSync,
} from 'fs'
import inquirer from 'inquirer'
import ora from 'ora'
import path from 'path'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const CURRENT_USER_DIR = process.cwd()

const fileBlacklist = ['.aws-sam', 'node_modules', 'dist', '.turbo']

const modulesOptions = [
    'Unit Tests',
    'E2E Tests',
    'User authentication',
    'DynamoDB utilities',
    'Media storage',
    'Jenkins pipeline',
]

async function createProject(answers) {
    const { projectName } = answers
    const projectDir = path.join(CURRENT_USER_DIR, projectName)
    const coreFilesPath = path.join(__dirname, '..', 'core')
    const optionalDir = path.join(__dirname, 'optional')

    const spinner = ora('Scaffolding the project').start()

    try {
        mkdirSync(path.join(CURRENT_USER_DIR, projectName))
        const filesToCopy = readdirSync(coreFilesPath)

        filesToCopy.forEach(file => {
            cpSync(
                path.join(coreFilesPath, file),
                path.join(projectDir, file),
                {
                    recursive: true,
                    filter: file =>
                        !fileBlacklist.includes(path.basename(file)),
                },
            )
        })

        const packageJsonPath = path.join(projectDir, 'package.json')
        const pkgFile = readFileSync(packageJsonPath, {
            encoding: 'utf-8',
        })
        const newPkg = { ...JSON.parse(pkgFile), name: projectName }
        writeFileSync(packageJsonPath, JSON.stringify(newPkg, null, 4))

        copyFileSync(
            path.join(optionalDir, '_gitignore'),
            path.join(projectDir, '.gitignore'),
        )

        spinner.succeed('Project initialized')
    } catch (error) {
        spinner.fail('Failed to scaffold the project')
        throw error
    }

    spinner.start('Applying modules')
    spinner.succeed('Optional modules applied')
}

export function handleCreateProject() {
    inquirer
        .prompt([
            {
                name: 'projectName',
                message: 'How do you want to name the project?',
            },
            {
                name: 'modulesIncluded',
                message: 'What modules to you want to include?',
                choices: modulesOptions,
                type: 'checkbox',
            },
            {
                name: 'initializeGit',
                message: 'Initialize a Git repository?',
                type: 'confirm',
            },
        ])
        .then(async answers => await createProject(answers))
}
