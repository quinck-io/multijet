import chalk from 'chalk'
import { cpSync, existsSync } from 'fs'
import ora from 'ora'
import path from 'path'
import { changePackageName } from './helper.js'

import { execa } from 'execa'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CURRENT_USER_DIR = process.cwd()

export async function handleCreateMicroservice(serviceName) {
    const templateDir = path.join(__dirname, 'templates', 'service')
    const servicePackageName = `@microservices/${serviceName}`
    const microservicesDir = path.join(CURRENT_USER_DIR, 'microservices')
    const newServiceDir = path.join(microservicesDir, serviceName)

    const spinner = ora('Scaffolding microservice')

    if (!existsSync(microservicesDir)) {
        spinner.fail('You are not inside a Multijet project')
        return
    }
    if (existsSync(newServiceDir)) {
        spinner.fail('A microservice with the given name already exists')
        return
    }
    if (!serviceName || serviceName === '') {
        spinner.fail('Please provide a name')
        return
    }

    cpSync(templateDir, newServiceDir, { recursive: true })
    changePackageName(newServiceDir, servicePackageName)
    spinner.succeed('Microservice created')

    spinner.start('Installing dependencies')
    await execa('npm', ['i'], { cwd: newServiceDir }).catch(error => {
        spinner.fail('Failed to install dependencies')
        throw error
    })
    spinner.succeed('Dependenicies installed')

    console.log(chalk.blue.bold('Your new microservice is ready!'))
}
