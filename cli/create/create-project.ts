import prompts from "prompts"

import {
    CICD_CHOICES,
    OPTIONAL_LIBS,
    RUNTIME_CHOICES,
    VARIANT_CHOICES,
} from "./consts.js"
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
        {
            name: "cicds",
            message: "Do you want to include CI/CD?",
            type: "multiselect",
            choices: CICD_CHOICES,
        },
    ])

    if (response.variant === Variant.CORE) {
        const libResponse = await prompts({
            name: "libsIncluded",
            message: "What libs do you want to include?",
            type: "multiselect",
            choices: OPTIONAL_LIBS,
        })
        Object.assign(response, libResponse)
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
