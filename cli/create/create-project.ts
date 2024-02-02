import prompts from "prompts"

import { OPTIONAL_LIBS, RUNTIME_CHOICES, VARIANT_CHOICES } from "./consts.js"
import { CreateProjectResponse, Variant } from "./models.js"
import { scaffoldProject } from "./scaffold.js"

export async function handleCreateProject() {
    const response = await prompts([
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
            name: "variant",
            message: "Select the multijet flavor to use",
            type: "select",
            choices: VARIANT_CHOICES,
        },
        {
            name: "runtime",
            message: "What runtime do you want to use?",
            type: "select",
            choices: RUNTIME_CHOICES,
        },
    ])

    if (response.variant === Variant.CORE) {
        const moduleResponse = await prompts({
            name: "modulesIncluded",
            message: "What modules do you want to include?",
            type: "multiselect",
            choices: OPTIONAL_LIBS,
        })
        Object.assign(response, moduleResponse)
    }

    const gitResponse = await prompts({
        name: "initializeGit",
        message: "Initialize a Git repository?",
        type: "confirm",
        initial: true,
    })

    const finalResponse: CreateProjectResponse = { ...response, ...gitResponse }

    const projectName = response.projectName
        .trim()
        .replaceAll(" ", "-")
        .replace(/[^\w\d\s-]/g, "")

    await scaffoldProject(projectName, finalResponse)
}
