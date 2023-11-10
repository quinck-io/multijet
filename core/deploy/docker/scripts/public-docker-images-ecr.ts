import {
    CreateRepositoryCommand,
    DescribeRepositoriesCommand,
    ECRPUBLICClient,
    Repository,
} from '@aws-sdk/client-ecr-public'
import { program } from 'commander'
import { Options } from 'execa'

const ecrPublicUrl = 'public.ecr.aws/v2w8j5u2'

async function createECRRepository(
    repositoryName: string,
): Promise<Repository> {
    const client = new ECRPUBLICClient({ region: 'us-east-1' })

    const command = new CreateRepositoryCommand({
        repositoryName,
    })

    const { repository } = await client.send(command)

    return repository!
}

async function getRepositoryUri(repoName: string): Promise<string> {
    const client = new ECRPUBLICClient({ region: 'us-east-1' })

    const command = new DescribeRepositoriesCommand({
        repositoryNames: [repoName],
    })

    try {
        const { repositories } = await client.send(command)

        const [{ repositoryUri }] = repositories!

        return repositoryUri!
    } catch (error) {
        if (
            error instanceof Error &&
            error.name == 'RepositoryNotFoundException'
        ) {
            const { repositoryUri } = await createECRRepository(repoName)

            return repositoryUri!
        }

        throw error
    }
}

const shell = async (command: string, args: string[], options?: Options) => {
    const result = (await import('execa')).execa(command, args, {
        all: true,
        stdout: 'pipe',
        stderr: 'pipe',
        ...options,
    })

    if (result.pipeStdout) result.pipeStdout(process.stdout)
    if (result.pipeStderr) result.pipeStderr(process.stderr)

    return result
}

const authenticateDockerClient = async () => {
    const { stdout } = await shell('aws', [
        'ecr-public',
        'get-login-password',
        '--region',
        'us-east-1',
    ])
    const loginPassword = stdout.trim()

    await shell(
        'docker',
        ['login', '--username', 'AWS', '--password-stdin', ecrPublicUrl],
        {
            input: loginPassword,
        },
    )
}

const moveImageToECR = async ({ image, tag, platform }: ProgramOptions) => {
    const source = `${image}:${tag}`

    await shell('docker', ['pull', `--platform=${platform}`, source])

    const repositoryUri = await getRepositoryUri(image)
    const target = `${repositoryUri}:${tag}`

    await authenticateDockerClient()
    await shell('docker', ['tag', source, target])
    await shell('docker', ['push', target])
}

type ProgramOptions = {
    platform: string
    image: string
    tag: string
}

program
    .requiredOption('-p, --platform <platform>', 'build platform')
    .requiredOption('-i, --image <image>', 'image to be pulled')
    .requiredOption('-t, --tag <tag>', 'image tag')
    .action(async () => {
        const { platform, image, tag } = program.opts() as ProgramOptions

        await moveImageToECR({ platform, image, tag })
    })
    .parse(process.argv)
