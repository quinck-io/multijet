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
import { FILE_BLACKLIST } from "./consts.js"
import { changePackageName } from "./helper.js"
import { CreateProjectResponse, Runtime } from "./models.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function scaffoldProject(
    projectName: string,
    answers: CreateProjectResponse,
) {
    const { modulesIncluded, initializeGit, projectDir } = answers

    const coreFilesPath = path.join(__dirname, "..", "..", "core")
    const optionalDir = path.join(__dirname, "..", "res", "optional")
    const pManager = answers.runtime === Runtime.NODE ? "npm" : "bun"

    const spinner = ora("Scaffolding the project").start()

    try {
        mkdirSync(projectDir)
        const filesToCopy = readdirSync(coreFilesPath)

        filesToCopy.forEach(file => {
            cpSync(
                path.join(coreFilesPath, file),
                path.join(projectDir, file),
                {
                    recursive: true,
                    filter: file =>
                        !FILE_BLACKLIST.includes(path.basename(file)),
                },
            )
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

        spinner.succeed("Project initialized")
    } catch (error) {
        spinner.fail("Failed to scaffold the project")
        throw error
    }

    spinner.start("Applying modules")
    // await applyOptionalModules(
    //     projectName,
    //     projectDir,
    //     modulesIncluded,
    // ).catch(error => {
    //     spinner.fail("Failed to apply optional modules")
    //     throw error
    // })
    spinner.succeed("Optional modules applied")

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
}
