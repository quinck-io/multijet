#!/usr/bin/env node

import chalk from 'chalk'
import { handleCreateProject } from './create-project.js'

const [command] = process.argv.slice(2)

console.log(`${chalk.white.bgBlue(' MULTIJET ')} CLI v1.0.0`)

switch (command) {
    case 'create':
        handleCreateProject()
        break
    case 'new-service':
        break
    case 'new-lib':
        break
    default:
        console.log('please provide an option')
        break
}
