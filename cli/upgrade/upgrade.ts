import chalk from "chalk"
import { execa } from "execa"
import { readFileSync } from "fs"
import ora from "ora"
import path, { dirname } from "path"
import prompts from "prompts"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function upgradeCli() {
    const spinner = ora("Retrieving package info...").start()

    const rootPath = path.join(__dirname, "..", "..")
    const packageJsonRaw = readFileSync(
        path.join(rootPath, "package.json"),
        "utf-8",
    )
    const packageJson = JSON.parse(packageJsonRaw)

    const installedVer = packageJson.version
    const { stdout: newVer } = await execa("npm", [
        "show",
        "multijet",
        "version",
    ]).catch(e => {
        spinner.fail("Failed to retrieve package info!")
        console.log(chalk.red(e))
        process.exit(1)
    })

    spinner.succeed("Ready!")
    console.log("Installed version:", chalk.yellow(installedVer))
    console.log("New version:", chalk.yellow(newVer))
    if (installedVer === newVer) {
        console.log(chalk.green("You are already on the latest version!"))
        return
    }

    const response = await prompts([
        {
            name: "packageManager",
            message: "Select a package manager",
            type: "select",
            choices: [
                { title: "npm", value: "npm", selected: true },
                { title: "bun", value: "bun" },
            ],
        },
    ])
    spinner.start("Upgrading multijet...")
    try {
        await execa(response.packageManager, ["i", "-g", "multijet@latest"])
        spinner.succeed("Successfully upgraded!")
        console.log(chalk.yellow(installedVer), "->", chalk.green(newVer))
    } catch (e) {
        spinner.fail("Failed to upgrade!")
        console.log(chalk.red(e))
    }
}
