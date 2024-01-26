import { Choice } from "prompts"

export enum Runtime {
    NODE = "node",
    BUN = "bun",
}

export const RUNTIME_CHOICES: Choice[] = [
    { title: "Node.js", value: Runtime.NODE, selected: true },
    { title: "Bun", value: Runtime.BUN },
]

export const OPTIONAL_LIBS: Choice[] = [
    { title: "Cognito Authentication", value: "auth" },
    { title: "S3 Media Storage", value: "media" },
    { title: "DynamoDB Utils", value: "dynamo" },
]
