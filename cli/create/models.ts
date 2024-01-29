export interface CreateProjectResponse {
    projectName: string
    projectDir: string
    runtime: Runtime
    modulesIncluded: string[]
    initializeGit: boolean
}

export enum Runtime {
    NODE = "node",
    BUN = "bun",
}
