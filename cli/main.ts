#!/usr/bin/env node

import chalk from "chalk"
import { Command } from "commander"
import { handleCreateProject } from "./create/create-project.js"

const version = "2.0.0"
const cli = new Command()

cli.name("multijet").description("multijet CLI").version(version)

cli.command("create")
    .description(chalk.magenta("create a new Multijet project"))
    .action(() => handleCreateProject())

const newCommand = new Command("new")
    .description(chalk.green("generate a mjet module"))
    .arguments("<module>")

newCommand
    .command("ms")
    .description("generate a microservice")
    .argument("<name>", "name of the microservice")
newCommand
    .command("lib")
    .description("generate a shared library")
    .argument("<name>", "name of the library")
newCommand
    .command("pkg")
    .description("generate a basic package")
    .argument("<name>", "name of the package")

cli.addCommand(newCommand)

cli.command("upgrade").description(
    chalk.yellow("update multijet to the latest version"),
)

cli.addHelpText(
    "after",
    chalk.gray(`
Examples:
  $ mjet create
  $ mjet new lib my-library
  $ mjet new ms my-microservice`),
)

console.log(chalk.white.bgBlue(" multijet "))
cli.parse()
