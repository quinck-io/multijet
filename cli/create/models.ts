export interface CreateProjectResponse {
    projectName: string
    projectDir: string
    variant: Variant
    runtime: Runtime
    libsIncluded?: string[]
    initializeGit: boolean
    cicds?: string[][]
}

export enum Variant {
    CORE = "core",
    MINIMAL = "minimal",
}

export enum Runtime {
    NODE = "node",
    BUN = "bun",
}
