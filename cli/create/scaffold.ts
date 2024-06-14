import chalk from "chalk"
import { execa } from "execa"
import {
    copyFileSync,
    cpSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from "fs"
import ora from "ora"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import { changePackageName } from "../util.js"
import { FILE_BLACKLIST, getDockerComposeTemplate } from "./consts.js"
import { copyGihubWorkflows, copyOptionalLibs } from "./helper.js"
import { CreateProjectResponse, Runtime, Variant } from "./models.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function scaffoldProject(
    projectName: string,
    answers: CreateProjectResponse,
) {
    const { libsIncluded, initializeGit, projectDir, variant, cicds } = answers

    const rootFilesPath = path.join(__dirname, "..", "..")
    const coreFilesPath = path.join(rootFilesPath, "core")
    const minimalFilesPath = path.join(rootFilesPath, "minimal")
    const optionalDir = path.join(__dirname, "..", "res", "optional")
    const pManager = answers.runtime === Runtime.NODE ? "npm" : "bun"

    const spinner = ora("Scaffolding the project").start()

    const variantDir =
        variant === Variant.CORE ? coreFilesPath : minimalFilesPath

    try {
        mkdirSync(projectDir)
        const filesToCopy = readdirSync(variantDir)

        filesToCopy.forEach(file => {
            cpSync(path.join(variantDir, file), path.join(projectDir, file), {
                recursive: true,
                filter: file => !FILE_BLACKLIST.includes(path.basename(file)),
            })
        })
        changePackageName(projectDir, projectName)

        copyFileSync(
            path.join(optionalDir, "_gitignore"),
            path.join(projectDir, ".gitignore"),
        )

        const readmeFilePath = path.join(projectDir, "README.md")
        const readmeLines = readFileSync(readmeFilePath, "utf-8")
            .split("\n")
            .slice(1)
        writeFileSync(
            readmeFilePath,
            [`# ${projectName}`, ...readmeLines].join("\n"),
        )

        // scaffold docker compose
        const dockerComposePath = path.join(projectDir, "docker-compose.yml")
        writeFileSync(dockerComposePath, getDockerComposeTemplate(projectName))

        spinner.succeed("Project initialized")
    } catch (error) {
        spinner.fail("Failed to scaffold the project")
        throw error
    }

    if (variant === Variant.CORE && libsIncluded) {
        spinner.start("Applying modules")
        try {
            copyOptionalLibs(rootFilesPath, projectDir, libsIncluded)
        } catch (error) {
            spinner.fail("Failed to apply optional modules")
            throw error
        }
        spinner.succeed("Optional modules applied")
    }

    spinner.start("Installing dependencies")
    await execa(pManager, ["i"], { cwd: projectDir }).catch(error => {
        spinner.fail(
            `Failed to install dependencies! is ${pManager} installed?`,
        )
        throw error
    })
    spinner.succeed("Dependenicies installed")

    if (initializeGit) {
        spinner.start("Initializing Git repository")
        try {
            await execa("git", ["init"], { cwd: projectDir })
            await execa("git", ["add", "-A"], { cwd: projectDir })
        } catch (error) {
            spinner.fail("Failed to initialize repository! is Git installed?")
            throw error
        }

        spinner.succeed("Repository initialized")
    }

    if (cicds && cicds.length > 0) {
        spinner.start("Setting up CI/CD")
        try {
            copyGihubWorkflows(rootFilesPath, projectDir, cicds.flat())
        } catch (error) {
            spinner.fail("Failed to set up CI/CD")
            throw error
        }
        spinner.succeed("CI/CD set up")
    }

    console.log(
        "\n",
        chalk.blue(
            `${chalk.bold(
                "Your project is ready!",
            )} Enjoy the speed of Multijet:`,
        ),
    )
    console.log("-", chalk.yellow(`cd ${projectName}`))
    console.log("-", chalk.yellow(`${pManager} run build`))
}
