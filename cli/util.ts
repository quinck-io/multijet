import { existsSync, readFileSync, writeFileSync } from "fs"
import path from "path"

export function changePackageName(basePath: string, newName: string) {
    const packageJsonPath = path.join(basePath, "package.json")
    const pkgFile = readFileSync(packageJsonPath, {
        encoding: "utf-8",
    })
    const newPkg = { ...JSON.parse(pkgFile), name: newName }
    writeFileSync(packageJsonPath, JSON.stringify(newPkg, null, 4))
}

export function trimName(name: string) {
    return name
        .trim()
        .replaceAll(" ", "-")
        .replace(/[^\w\d\s-]/g, "")
}

export function getPackageManager(projectPath: string): "npm" | "bun" {
    if (existsSync(path.join(projectPath, "bun.lockb"))) {
        return "bun"
    }
    return "npm"
}
