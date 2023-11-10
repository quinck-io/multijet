/* eslint-disable */

import {
    CreateRepositoryCommand,
    DescribeRepositoriesCommand,
    ECRClient,
    Repository,
} from '@aws-sdk/client-ecr'
import { program } from 'commander'
import { readdirSync } from 'fs'
import { writeFile } from 'fs/promises'

const log = (label: string, text: string) => console.log(`${label}: ${text}`)

const awsRegion = process.env.AWS_REGION!

async function getRepositoryUri(repoName: string): Promise<string> {
    const client = new ECRClient()

    const command = new DescribeRepositoriesCommand({
        repositoryNames: [repoName],
    })

    try {
        const { repositories } = await client.send(command)

        const [{ repositoryUri }] = repositories!

        return repositoryUri!
    } catch (error: unknown) {
        if (
            error instanceof Error &&
            error.name == 'RepositoryNotFoundException'
        ) {
            const { repositoryUri } = await createECRRepository(repoName)

            return repositoryUri!
        }

        console.error('Error describing repositories:', error)
        throw error
    }
}

const getDoackerImageDigest = async (image: string): Promise<string> => {
    const { execa } = await import('execa')

    const { stdout } = await execa('docker', ['image', 'inspect', image])

    const imageInfo = JSON.parse(stdout)[0]

    return imageInfo.RepoDigests[0]
}

async function createECRRepository(
    repositoryName: string,
): Promise<Repository> {
    const client = new ECRClient()

    const command = new CreateRepositoryCommand({
        repositoryName,
    })

    try {
        const { repository } = await client.send(command)

        console.log(
            'Repository created successfully:',
            repository!.repositoryUri,
        )

        return repository!
    } catch (error) {
        console.error('Error creating repository:', error)
        throw error
    }
}

const awsECRAccount = (repoUri: string) =>
    `${repoUri.split('.')[0]}.dkr.ecr.${awsRegion}.amazonaws.com`

const authenticateDockerClient = async (repoUri: string) => {
    const { execa } = await import('execa')

    const { stdout } = await execa('aws', ['ecr', 'get-login-password'])
    const loginPassword = stdout.trim()

    const awsAccount = awsECRAccount(repoUri)

    await execa(
        'docker',
        ['login', '--username', 'AWS', '--password-stdin', awsAccount],
        {
            input: loginPassword,
        },
    )
}

const tagDockerImage = async (source: string, target: string) => {
    const { execa } = await import('execa')

    await execa('docker', ['tag', source, target])
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
) {
    const repoName = `${projectName}/${microservice}`
    const imageTag = `latest-${env}`

    const repositoryUri = await getRepositoryUri(repoName)

    const source = `${projectName}-${microservice}`
    const target = `${repositoryUri}:${imageTag}`

    await tagDockerImage(source, target)

    log(microservice, 'Push started')

    await authenticateDockerClient(repositoryUri)
    await pushDockerImage(target)

    log(microservice, 'Image pushed')

    return [microservice, await getDoackerImageDigest(target)]
}

async function pushMicroservices(
    env: string,
    projectName: string,
    microservicesFile: string,
) {
    const microservices = readdirSync('microservices')

    const pushedMicroservicesInformation = microservices.map(microservice =>
        pushMicroservice(microservice, env, projectName),
    )

    const microservicesInformation = (
        await Promise.all(pushedMicroservicesInformation)
    ).reduce((acc, [microservice, digest]) => {
        acc[microservice] = { image: digest }
        return acc
    }, {} as Record<string, unknown>)

    await writeFile(microservicesFile, JSON.stringify(microservicesInformation))

    console.log(`\nFinished in ${process.uptime().toFixed(2)} seconds`)
}

program
    .argument('<env>', 'Environment')
    .argument('<projectName>', 'Project name')
    .argument('<microservicesFile>', 'Microservice file')
    .action(
        async (env: string, projectName: string, microservicesFile: string) => {
            await pushMicroservices(env, projectName, microservicesFile)
        },
    )
    .parse(process.argv)
