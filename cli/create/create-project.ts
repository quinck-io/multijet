import prompts from "prompts"

import { OPTIONAL_LIBS, RUNTIME_CHOICES } from "./consts.js"
import { CreateProjectResponse } from "./models.js"
import { scaffoldProject } from "./scaffold.js"

export async function handleCreateProject() {
    const response: CreateProjectResponse = await prompts([
        {
            name: "projectName",
            message: "How do you want to name the project?",
            type: "text",
        },
        {
            name: "projectDir",
            message: "Where do you want to place the project?",
            type: "text",
            initial: prev => prev,
        },
        {
            name: "runtime",
            message: "What runtime do you want to use?",
            type: "select",
            choices: RUNTIME_CHOICES,
        },
        {
            name: "modulesIncluded",
            message: "What modules do you want to include?",
            type: "multiselect",
            choices: OPTIONAL_LIBS,
        },
        {
            name: "initializeGit",
            message: "Initialize a Git repository?",
            type: "confirm",
            initial: true,
        },
    ])

    const projectName = response.projectName
        .trim()
        .replaceAll(" ", "-")
        .replace(/[^\w\d\s-]/g, "")

    await scaffoldProject(projectName, response)
}
