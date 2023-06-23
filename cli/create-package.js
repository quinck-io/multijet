import chalk from 'chalk'
import { cpSync, existsSync } from 'fs'
import ora from 'ora'
import path, { dirname } from 'path'
import { changePackageName } from './helper/helper.js'

import { execa } from 'execa'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CURRENT_USER_DIR = process.cwd()

/**
 * Handles the creation of a new package, including scaffolding, renaming, and installing dependencies.
 *
 * @param {string} rawPackageName - The name for the new package.
 * @param {'lib' | 'microservice'} packageType - The type of the package, can be 'lib' or 'microservice'.
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if the installation of dependencies fails.
 */
export async function handleCreatePackage(rawPackageName, packageType) {
    const packageName = rawPackageName
        .trim()
        .replaceAll(' ', '-')
        .replace(/[^\w\d\s-]/g, '')

    const templateDir = path.join(__dirname, 'templates', packageType)
    const subfolderName = packageType === 'lib' ? 'libs' : 'microservices'
    const fullPackageName = `@${subfolderName}/${packageName}`
    const workspaceDir = path.join(CURRENT_USER_DIR, subfolderName)
    const newPackageDir = path.join(workspaceDir, packageName)

    const spinner = ora(`Scaffolding ${packageType} '${packageName}'`)

    if (!existsSync(workspaceDir)) {
        spinner.fail('You are not inside a Multijet project')
        return
    }
    if (existsSync(newPackageDir)) {
        spinner.fail(`A ${packageType} with the given name already exists`)
        return
    }
    if (!packageName || packageName === '') {
        spinner.fail('Please provide a name')
        return
    }

    cpSync(templateDir, newPackageDir, { recursive: true })
    changePackageName(newPackageDir, fullPackageName)
    spinner.succeed('Package created')

    spinner.start('Installing dependencies')
    await execa('npm', ['i'], { cwd: newPackageDir }).catch(error => {
        spinner.fail('Failed to install dependencies')
        throw error
    })
    spinner.succeed('Dependenicies installed')

    console.log(chalk.blue.bold(`Your new ${packageType} is ready!`))
}
