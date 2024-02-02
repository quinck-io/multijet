import chalk from "chalk"
import { execa } from "execa"
import { cpSync, existsSync } from "fs"
import ora from "ora"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import { changePackageName, getPackageManager, trimName } from "../util.js"
import { Namespace, templates } from "./consts.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CURRENT_USER_DIR = process.cwd()

export async function generateModule(name: string, ns: Namespace) {
    const packageName = trimName(name)
    const packageType = templates[ns]
    const templateDir = path.join(
        __dirname,
        "..",
        "res",
        "templates",
        packageType,
    )
    const workspaceDir = path.join(CURRENT_USER_DIR, ns)
    const newPackageDir = path.join(workspaceDir, packageName)
    const pManager = getPackageManager(CURRENT_USER_DIR)

    const spinner = ora(`Generating '${packageName}'...`).start()

    if (!existsSync(workspaceDir)) {
        spinner.fail(
            `${ns} directory does not exist. Are you in a Multijet project?`,
        )
        return
    }

    if (existsSync(newPackageDir)) {
        spinner.fail(`A package with the name ${packageName} already exists`)
        return
    }

    if (!packageName || packageName === "") {
        spinner.fail("Please provide a name")
        return
    }

    cpSync(templateDir, newPackageDir, { recursive: true })
    changePackageName(newPackageDir, `@${ns}/${packageName}`)
    spinner.succeed(`Generated ${packageType} '${packageName}'`)

    spinner.start(`${pManager} detected, installing dependencies...`)
    await execa(pManager, ["i"]).catch(error => {
        spinner.fail("Failed to install dependencies")
        throw error
    })
    spinner.succeed(`Installed dependencies with ${pManager}`)

    console.log(chalk.blue.bold(`Your new ${packageType} is ready!`))
}
