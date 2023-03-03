import '@quinck/collections'
import { mkdirSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import {
    StackOutputs,
    StackParamsType,
    createStackManager,
} from '../../libs/stack-manager/src'

export type MeddleSaaSStackOutputs = {
    ApiEndpoint: string
    UserPoolId: string
}

function parseOutputs(
    outputs: StackOutputs<keyof MeddleSaaSStackOutputs>,
): MeddleSaaSStackOutputs {
    return outputs.toArray().groupByToDictionary(
        ([key]) => key,
        ([, value]) => value,
    )
}

async function execute() {
    const [stackName, outputsFile] = process.argv.slice(2)

    const manager = createStackManager<
        StackParamsType,
        keyof MeddleSaaSStackOutputs
    >()

    const { outputs } = await manager.getStack(stackName)

    if (outputs) {
        mkdirSync(dirname(outputsFile), { recursive: true })
        writeFileSync(
            outputsFile,
            JSON.stringify(
                parseOutputs(
                    outputs as StackOutputs<keyof MeddleSaaSStackOutputs>,
                ),
                null,
                2,
            ),
        )
    }
}

execute()
