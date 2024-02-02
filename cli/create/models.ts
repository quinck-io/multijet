export interface CreateProjectResponse {
    projectName: string
    projectDir: string
    variant: Variant
    runtime: Runtime
    modulesIncluded: string[]
    initializeGit: boolean
}

export enum Variant {
    CORE = "core",
    MINIMAL = "minimal",
}

export enum Runtime {
    NODE = "node",
    BUN = "bun",
}
