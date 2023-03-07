import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

export function changePackageName(basePath, newName) {
    const packageJsonPath = path.join(basePath, 'package.json')
    const pkgFile = readFileSync(packageJsonPath, {
        encoding: 'utf-8',
    })
    const newPkg = { ...JSON.parse(pkgFile), name: newName }
    writeFileSync(packageJsonPath, JSON.stringify(newPkg, null, 4))
}
