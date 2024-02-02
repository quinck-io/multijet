/* eslint-disable */

import { program } from "commander"
import { readdir } from "fs/promises"
import path from "path"

// ------ Configure default options here ---------
const DEFAULT_PLATFORM = "linux/amd64"
const DEFAULT_IMAGE = "node:18-alpine" // use "oven/bun:alpine" for Bun runtime
const DEFAULT_SEQUENTIAL_BUILD = false
// ---------------------------------------------

type NonGenericMicroservice = {
    dockerfilePath?: string
    builderImage: string
    runnerImage: string
}

// ----- Define non-generic microservices here ---
const NON_GENERIC_MS: Record<string, NonGenericMicroservice> = {}
// -----------------------------------------------

const dockerfilePath = path.join(__dirname, "..", "Dockerfile")
const microservicesPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "microservices",
)
const getMicroservicePath = (microservice: string) =>
    path.join(microservicesPath, microservice)

const log = (label: string, ...text: unknown[]) =>
    console.log(`${label}: `, ...text)

const buildDockerImage = async (
    projectName: string,
    microservice: string,
    platform: string,
    fromImage: string,
) => {
    const { execa } = await import("execa")

    await execa("docker", [
        "build",
        ".",
        "-f",
        dockerfilePath,
        "-t",
        `${projectName}-${microservice}`,
        "--build-arg",
        `MICROSERVICE=${microservice}`,
        "--build-arg",
        `FROM_DOCKER_IMAGE=${fromImage}`,
        `--platform=${platform}`,
    ])
}

const buildNonGenericDockerImage = async (
    projectName: string,
    microservice: string,
    platform: string,
) => {
    const { execa } = await import("execa")

    await execa("docker", [
        "build",
        getMicroservicePath(microservice),
        "-f",
        NON_GENERIC_MS[microservice].dockerfilePath ??
            path.join(getMicroservicePath(microservice), "Dockerfile"),
        "-t",
        `${projectName}-${microservice}`,
        "--build-arg",
        `FROM_BUILDER_DOCKER_IMAGE=${NON_GENERIC_MS[microservice].builderImage}`,
        "--build-arg",
        `FROM_RUNNER_DOCKER_IMAGE=${NON_GENERIC_MS[microservice].runnerImage}`,
        `--platform=${platform}`,
    ])
}

async function buildMicroservice(
    projectName: string,
    microservice: string,
    platform: string,
    fromImage: string,
): Promise<void> {
    log(microservice, "Build started")
    if (Object.keys(NON_GENERIC_MS).includes(microservice)) {
        await buildNonGenericDockerImage(projectName, microservice, platform)
    } else {
        await buildDockerImage(projectName, microservice, platform, fromImage)
    }
    log(microservice, "Image created")
}

async function buildMicroservices(
    projectName: string,
    platform: string,
    fromImage: string,
    sequential: boolean,
) {
    const microservices = await readdir("microservices")
    log("main", "STARTED DOCKER BUILD")
    log("services to build", microservices)

    if (sequential) {
        for (const microservice of microservices) {
            await buildMicroservice(
                projectName,
                microservice,
                platform,
                fromImage,
            )
        }
    } else {
        const buildPromises = microservices.map(microservice =>
            buildMicroservice(projectName, microservice, platform, fromImage),
        )

        await Promise.all(buildPromises)
    }

    console.log(`\nFinished in ${process.uptime().toFixed(2)} seconds`)
}

program
    .argument("<projectName>", "Project name")
    .option("-p, --platform <platform>", "build platform", DEFAULT_PLATFORM)
    .option("-i, --fromImage <fromImage>", "build from image", DEFAULT_IMAGE)
    .option("--sequential", "build sequentially", DEFAULT_SEQUENTIAL_BUILD)
    .action(async (projectName: string) => {
        const options = program.opts()

        log("options", options)

        const { platform, fromImage, sequential } = options

        await buildMicroservices(projectName, platform, fromImage, sequential)
    })
    .parse(process.argv)
