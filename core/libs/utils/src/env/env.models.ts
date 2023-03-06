export enum NodeEnv {
    production = 'production',
    staging = 'staging',
    development = 'development',
    test = 'test',
}

export type CommonEnvironment = NodeJS.ProcessEnv & {
    NODE_ENV: NodeEnv
    LOGGER_NAME?: string
}
