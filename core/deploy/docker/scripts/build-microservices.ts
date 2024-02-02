/* eslint-disable */

import { program } from "commander"
import { readdir } from "fs/promises"
import path from "path"

type NonGenericMicroservice = {
    dockerfilePath?: string
    builderImage: string
    runnerImage: string
}

const DOCKERFILE_PATH = path.join(__dirname, "..", "Dockerfile")
const MICROSERVICES_PATH = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "microservices",
)
const getMicroservicePath = (microservice: string) =>
    path.join(MICROSERVICES_PATH, microservice)

// ----- Define non-generic microservices here ---
const NON_GENERIC: Record<string, NonGenericMicroservice> = {}
// -----------------------------------------------

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
        DOCKERFILE_PATH,
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
        NON_GENERIC[microservice].dockerfilePath ??
            path.join(getMicroservicePath(microservice), "Dockerfile"),
        "-t",
        `${projectName}-${microservice}`,
        "--build-arg",
        `FROM_BUILDER_DOCKER_IMAGE=${NON_GENERIC[microservice].builderImage}`,
        "--build-arg",
        `FROM_RUNNER_DOCKER_IMAGE=${NON_GENERIC[microservice].runnerImage}`,
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
    if (Object.keys(NON_GENERIC).includes(microservice)) {
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
    .option("-p, --platform <platform>", "build platform", "linux/amd64")
    .option("-i, --fromImage <fromImage>", "build from image", "node:18-alpine")
    .option("--sequential", "build sequentially", false)
    .action(async (projectName: string) => {
        const options = program.opts()

        log("options", options)

        const { platform, fromImage, sequential } = options

        await buildMicroservices(projectName, platform, fromImage, sequential)
    })
    .parse(process.argv)
