/* eslint-disable */

import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts'
import { program } from 'commander'
import { readdir } from 'fs/promises'
import path = require('path')

const DOCKERFILE_PATH = path.join(__dirname, '..', 'Dockerfile')

const log = (label: string, ...text: unknown[]) =>
    console.log(`${label}: `, ...text)

const getAWSAccountId = async (awsRegion: string): Promise<string> => {
    const stsClient = new STSClient({ region: awsRegion })

    try {
        const command = new GetCallerIdentityCommand({})
        const response = await stsClient.send(command)

        const awsAccountId = response.Account
        console.log('AWS Account ID:', awsAccountId)
        return awsAccountId
    } catch (error) {
        console.error('Error retrieving AWS Account ID:', error)
        throw error
    }
}

const getRepositoryUri = (
    awsAccountId: string,
    repoName: string,
    awsRegion: string,
) => `${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com/${repoName}`

const buildDockerImage = async (
    microservice: string,
    target: string,
    platform: string,
) => {
    const { execa } = await import('execa')

    await execa('docker', [
        'build',
        '.',
        '-f',
        DOCKERFILE_PATH,
        '-t',
        `${target}`,
        '--build-arg',
        `MICROSERVICE=${microservice}`,
        `--platform=${platform}`,
    ])
}

async function buildMicroservice(
    microservice: string,
    awsAccountId: string,
    env: string,
    projectName: string,
    platform: string,
    awsRegion: string,
): Promise<void> {
    const repoName = `${projectName}/${microservice}`
    const imageTag = `latest-${env}`

    const repositoryUri = getRepositoryUri(awsAccountId, repoName, awsRegion)

    const target = `${repositoryUri}:${imageTag}`

    log(microservice, 'Build started')

    await buildDockerImage(microservice, target, platform)

    log(microservice, 'Image created')

    log(microservice, 'Image pushed')
}

async function buildMicroservices(
    env: string,
    projectName: string,
    platform: string,
    awsRegion: string,
) {
    const microservices = await readdir('microservices')
    log('main', 'STARTED DOCKER BUILD')
    log('services to build:', microservices)

    const awsAccountId = await getAWSAccountId(awsRegion)

    const buildPromises = microservices.map(service =>
        buildMicroservice(
            service,
            awsAccountId,
            env,
            projectName,
            platform,
            awsRegion,
        ),
    )
    await Promise.all(buildPromises)

    console.log(`\nFinished in ${process.uptime().toFixed(2)} seconds`)
}

program
    .argument('<env>', 'Environment')
    .argument('<projectName>', 'Project name')
    .argument('<platform>', 'Platform')
    .action(async (env: string, projectName: string, platform: string) => {
        const { AWS_REGION } = process.env

        await buildMicroservices(env, projectName, platform, AWS_REGION)
    })
    .parse(process.argv)
