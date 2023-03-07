#!/usr/bin/env node

import chalk from 'chalk'
import { handleCreatePackage } from './create-package.js'
import { handleCreateProject } from './create-project.js'
import { LIB, MICROSERVICE } from './helper/consts.js'

const [command, secondArgument] = process.argv.slice(2)

console.log(`${chalk.white.bgBlue(' MULTIJET ')} CLI v1.0.0`)

switch (command) {
    case 'create':
        handleCreateProject()
        break
    case 'new-microservice':
        await handleCreatePackage(secondArgument, MICROSERVICE)
        break
    case 'new-lib':
        await handleCreatePackage(secondArgument, LIB)

        break
    default:
        console.log(
            'Please provide an argument.',
            chalk.gray('[create, new-microservice, new-lib]'),
        )
        break
}
