#!/usr/bin/env node

import chalk from "chalk"
import { Command } from "commander"
const version = "2.0.0"
const cli = new Command()

cli.name("multijet").description("multijet CLI").version(version)

cli.command("create").description("create a new Multijet project")

cli.command("new-lib")
    .description("generate a basic shared lib with given name")
    .argument("<name>", "name of the lib to generate")

cli.command("new-microservice")
    .description("generate a basic microservice with given name")
    .argument("<name>", "name of the service to generate")

console.log(chalk.white.bgBlue(" MULTIJET "))
cli.parse()
