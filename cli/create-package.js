import chalk from 'chalk'
import { cpSync, existsSync } from 'fs'
import ora from 'ora'
import path from 'path'
import { changePackageName } from './helper/helper.js'

import { execa } from 'execa'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CURRENT_USER_DIR = process.cwd()

export async function handleCreatePackage(packageName, packageType) {
    const templateDir = path.join(__dirname, 'templates', packageType)
    const fullPackageName = `@${packageType}/${packageName}`
    const workspaceDir = path.join(
        CURRENT_USER_DIR,
        packageType === 'lib' ? 'libs' : 'microservices',
    )
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
