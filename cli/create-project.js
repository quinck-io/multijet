import chalk from 'chalk'
import { execa } from 'execa'
import {
    copyFileSync,
    cpSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from 'fs'
import inquirer from 'inquirer'
import ora from 'ora'
import path from 'path'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FILE_BLACKLIST, OPTIONAL_MODULES } from './helper/consts.js'
import { changePackageName } from './helper/helper.js'
import { applyOptionalModules } from './helper/optional-scaffolder.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const CURRENT_USER_DIR = process.cwd()

async function createProject(projectName, answers) {
    const { modulesIncluded, initializeGit } = answers

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
                        !FILE_BLACKLIST.includes(path.basename(file)),
                },
            )
        })
        changePackageName(projectDir, projectName)

        copyFileSync(
            path.join(optionalDir, '_gitignore'),
            path.join(projectDir, '.gitignore'),
        )

        const readmeFilePath = path.join(projectDir, 'README.md')
        const readmeLines = readFileSync(readmeFilePath, 'utf-8')
            .split('\n')
            .slice(1)
        writeFileSync(
            readmeFilePath,
            [`# ${projectName}`, ...readmeLines].join('\n'),
        )

        spinner.succeed('Project initialized')
    } catch (error) {
        spinner.fail('Failed to scaffold the project')
        throw error
    }

    spinner.start('Applying modules')
    await applyOptionalModules(projectName, projectDir, modulesIncluded).catch(
        error => {
            spinner.fail('Failed to apply optional modules')
            throw error
        },
    )
    spinner.succeed('Optional modules applied')

    spinner.start('Installing dependencies')
    await execa('npm', ['i'], { cwd: projectDir }).catch(error => {
        spinner.fail('Failed to install dependencies')
        throw error
    })
    spinner.succeed('Dependenicies installed')

    if (initializeGit) {
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
}

export function handleCreateProject() {
    inquirer
        .prompt([
            {
                name: 'projectName',
                message: 'How do you want to name the project?',
                type: 'input',
            },
            {
                name: 'modulesIncluded',
                message: 'What modules to you want to include?',
                choices: OPTIONAL_MODULES,
                type: 'checkbox',
            },
            {
                name: 'initializeGit',
                message: 'Initialize a Git repository?',
                type: 'confirm',
            },
        ])
        .then(async answers => {
            const projectName = answers.projectName
                .trim()
                .replaceAll(' ', '-')
                .replace(/[^\w\d\s-]/g, '')

            await createProject(projectName, answers)
            console.log(
                '\n',
                chalk.blue(
                    `${chalk.bold(
                        'Your project is ready!',
                    )} Enjoy the speed of Multijet:`,
                ),
            )
            console.log('-', chalk.yellow(`cd ${projectName}`))
            console.log('-', chalk.yellow(`npm run build`))
        })
}
