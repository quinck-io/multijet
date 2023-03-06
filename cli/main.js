#!/usr/bin/env node

import chalk from 'chalk'
import { handleCreateProject } from './create-project.js'
import { handleCreateMicroservice } from './create-service.js'

const [command, secondArgument] = process.argv.slice(2)

console.log(`${chalk.white.bgBlue(' MULTIJET ')} CLI v1.0.0`)

switch (command) {
    case 'create':
        handleCreateProject()
        break
    case 'new-microservice':
        await handleCreateMicroservice(secondArgument)
        break
    case 'new-lib':
        break
    default:
        console.log(
            'Please provide an argument.',
            chalk.gray('[create, new-microservice, new-lib]'),
        )
        break
}
