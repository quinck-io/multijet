import { Runtime } from "./consts.js"

export interface CreateProjectResponse {
    projectName: string
    projectDir: string
    runtime: Runtime
    modulesIncluded: string[]
    initializeGit: boolean
}
