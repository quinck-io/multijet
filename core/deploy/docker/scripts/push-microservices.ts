/* eslint-disable */

import { readdirSync } from 'fs'
import path = require('path')

const ENV = process.env.ENVIRONMENT
const PROJECT_NAME = process.env.PROJECT_NAME
const DOCKERFILE_PATH = path.join('..', '..', 'deploy', 'docker', 'Dockerfile')
const DOCKER_PLATFORM = 'linux/amd64'

const log = (label: string, text: string) => console.log(`${label}: ${text}`)

async function buildMicroservice(name: string): Promise<void> {
    const { execa } = await import('execa')
    // const repoName = 'meddle/openvpn-client'
    // const describeCommandOutput = execSync(
    //     'aws ecr describe-repositories --repository-names ' + repoName,
    // ).toString()
    // const describeOutput = JSON.parse(describeCommandOutput)

    // const repositoryUri = describeOutput.repositories
    //     ? describeOutput.repositories.find(
    //           repo => repo.repositoryName === repoName,
    //       ).repositoryUri
    //     : describeOutput.repository

    // if (!repositoryUri) throw new Error('cannot retrieve repository URI')
    log(name, 'Build started')

    await execa(
        'docker',
        [
            'build',
            '.',
            '-f',
            DOCKERFILE_PATH,
            '-t',
            `${PROJECT_NAME}/${name}:latest-${ENV}`,
            `--platform=${DOCKER_PLATFORM}`,
        ],
        {
            cwd: path.join('microservices', name),
        },
    )
    log(name, 'Image created')
}

async function buildAndPushMicroservices() {
    if (!ENV || !PROJECT_NAME) {
        console.error('One or more env variable is missing!')
        process.exit(1)
    }

    const services = readdirSync('microservices')
    console.log('STARTED DOCKER BUILD')
    console.log('services to build:', services, '\n')

    const buildPromises = services.map(service => buildMicroservice(service))
    await Promise.all(buildPromises)

    console.log(`\nFinished in ${process.uptime().toFixed(2)} seconds`)
}

buildAndPushMicroservices()
