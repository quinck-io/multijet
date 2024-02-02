import { Choice } from "prompts"
import { Runtime, Variant } from "./models.js"

export const FILE_BLACKLIST = [
    ".aws-sam",
    "node_modules",
    "dist",
    ".turbo",
    "package-lock.json",
    "bun.lockb",
]

export const VARIANT_CHOICES: Choice[] = [
    {
        title: "Core",
        value: Variant.CORE,
        selected: true,
        description: "Full-featured multijet stack to build flexible REST APIs",
    },
    {
        title: "Minimal",
        value: Variant.MINIMAL,
        description: "Minimal monorepo template focused on essentials",
    },
]

export const RUNTIME_CHOICES: Choice[] = [
    { title: "Node.js", value: Runtime.NODE, selected: true },
    { title: "Bun", value: Runtime.BUN },
]

export const OPTIONAL_LIBS: Choice[] = [
    { title: "Cognito Authentication", value: "user-manager" },
    { title: "S3 Media Storage", value: "media-storage" },
    { title: "DynamoDB Utils", value: "dynamoose-utils" },
]

export const getDockerComposeTemplate = (projectName: string) =>
    `
version: "3.8"

services:
    hello-service:
        image: ${projectName}-hello-service
        restart: unless-stopped
        env_file:
            - .env
        networks:
            - ${projectName}-net

    api-gateway:
        image: nginx:alpine
        volumes:
            - ./nginx.conf:/etc/nginx/nginx.conf
        ports:
            - "3000:3000"
        networks:
            - ${projectName}-net
networks:
    ${projectName}-net:
`.trimStart()
