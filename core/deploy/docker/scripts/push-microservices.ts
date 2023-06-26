/* eslint-disable */

import {
    CreateRepositoryCommand,
    DescribeRepositoriesCommand,
    ECRClient,
    Repository,
} from '@aws-sdk/client-ecr'
import { program } from 'commander'
import { readdirSync } from 'fs'
import path = require('path')

const log = (label: string, text: string) => console.log(`${label}: ${text}`)

async function getRepositoryUri(
    repoName: string,
    awsRegion: string,
): Promise<string> {
    const client = new ECRClient({ region: awsRegion })

    const command = new DescribeRepositoriesCommand({
        repositoryNames: [repoName],
    })

    try {
        const { repositories } = await client.send(command)
        const { repositoryUri } = repositories[0]

        console.log('Repository found:', repositoryUri)

        return repositoryUri
    } catch (error: unknown) {
        console.error('Error describing repositories:', error)

        if (
            error instanceof Error &&
            error.name == 'RepositoryNotFoundException'
        ) {
            const { repositoryUri } = await createECRRepository(
                repoName,
                awsRegion,
            )

            return repositoryUri
        }

        console.error('Error describing repositories:', error)
        throw error
    }
}

async function createECRRepository(
    repositoryName: string,
    awsRegion: string,
): Promise<Repository> {
    const client = new ECRClient({ region: awsRegion })

    const command = new CreateRepositoryCommand({
        repositoryName,
    })

    try {
        const { repository } = await client.send(command)

        console.log(
            'Repository created successfully:',
            repository.repositoryUri,
        )

        return repository
    } catch (error) {
        console.error('Error creating repository:', error)
        throw error
    }
}

const awsECRAccount = (repoUri: string, awsRegion: string) =>
    `${repoUri.split('.')[0]}.dkr.ecr.${awsRegion}.amazonaws.com`

const authenticateDockerClient = async (repoUri: string, awsRegion: string) => {
    const { execa } = await import('execa')

    const { stdout } = await execa('aws', [
        'ecr',
        'get-login-password',
        '--region',
        awsRegion,
    ])

    const loginPassword = stdout.trim()
    const awsAccount = awsECRAccount(repoUri, awsRegion)

    await execa(
        'docker',
        ['login', '--username', 'AWS', '--password-stdin', awsAccount],
        {
            input: loginPassword,
        },
    )
}

const pushDockerImage = async (target: string) => {
    const { execa } = await import('execa')

    await execa('docker', ['push', target], {
        stdio: 'inherit',
    })
}

async function pushMicroservice(
    microservice: string,
    env: string,
    projectName: string,
    awsRegion: string,
): Promise<void> {
    const repoName = `${projectName}/${microservice}`
    const imageTag = `latest-${env}`

    const repositoryUri = await getRepositoryUri(repoName, awsRegion)

    const target = `${repositoryUri}:${imageTag}`

    log(microservice, 'Push started')

    await authenticateDockerClient(repositoryUri, awsRegion)
    await pushDockerImage(target)

    log(microservice, 'Image pushed')
}

async function pushMicroservices(
    env: string,
    projectName: string,
    awsRegion: string,
) {
    const microservices = readdirSync('microservices')

    const pushPromises = microservices.map(microservice =>
        pushMicroservice(microservice, env, projectName, awsRegion),
    )
    await Promise.all(pushPromises)

    console.log(`\nFinished in ${process.uptime().toFixed(2)} seconds`)
}

program
    .argument('<env>', 'Environment')
    .argument('<projectName>', 'Project name')
    .action(async (env: string, projectName: string) => {
        const { AWS_REGION } = process.env

        await pushMicroservices(env, projectName, AWS_REGION)
    })
    .parse(process.argv)
