import chalk from 'chalk'
import { execa } from 'execa'
import { copyFileSync, cpSync, mkdirSync, readdirSync } from 'fs'
import inquirer from 'inquirer'
import ora from 'ora'
import path from 'path'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { changePackageName } from './helper/helper.js'

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
        changePackageName(projectDir, projectName)

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

    spinner.start('Installing dependencies')
    await execa('npm', ['i'], { cwd: projectDir }).catch(error => {
        spinner.fail('Failed to install dependencies')
        throw error
    })
    spinner.succeed('Dependenicies installed')

    spinner.start('Initializing Git repository')
    try {
        await execa('git', ['init'], { cwd: projectDir })
        await execa('git', ['add', '-A'], { cwd: projectDir })
    } catch (error) {
        spinner.fail('Failed to initialize repository! is Git installed?')
        throw error
    }

    spinner.succeed('Repository initialized')
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
                name: 'exampleService',
                message: 'Include an example microservice?',
                type: 'confirm',
            },
            {
                name: 'initializeGit',
                message: 'Initialize a Git repository?',
                type: 'confirm',
            },
        ])
        .then(async answers => {
            await createProject(answers)
            console.log(
                chalk.blue(
                    `${chalk.bold(
                        'Your project is ready!',
                    )} Enjoy the speed of Multijet:`,
                ),
            )
            console.log('-', chalk.yellow(`cd ${answers.projectName}`))
            console.log('-', chalk.yellow(`npm run build`))
        })
}