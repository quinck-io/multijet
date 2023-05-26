#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import { handleCreatePackage } from './create-package.js'
import { handleCreateProject } from './create-project.js'

const version = '2.0.0'
const cli = new Command()

cli.name('multijet').description('multijet CLI').version(version)

cli.command('create')
    .description('create a new Multijet project')
    .action(handleCreateProject)

cli.command('new-lib')
    .description('generate a basic shared lib with given name')
    .argument('<name>', 'name of the lib to generate')
    .action(async name => {
        await handleCreatePackage(name, 'lib')
    })

cli.command('new-microservice')
    .description('generate a basic microservice with given name')
    .argument('<name>', 'name of the service to generate')
    .action(async name => {
        await handleCreatePackage(name, 'microservice')
    })

console.log(chalk.white.bgBlue(' MULTIJET '))
cli.parse()
