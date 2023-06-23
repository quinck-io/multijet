import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

/**
 * Changes the name of the package in the 'package.json' file.
 *
 * @param {string} basePath - The path to the directory containing the 'package.json' file.
 * @param {string} newName - The new name for the package.
 * @returns {void}
 */
export function changePackageName(basePath, newName) {
    const packageJsonPath = path.join(basePath, 'package.json')
    const pkgFile = readFileSync(packageJsonPath, {
        encoding: 'utf-8',
    })
    const newPkg = { ...JSON.parse(pkgFile), name: newName }
    writeFileSync(packageJsonPath, JSON.stringify(newPkg, null, 4))
}

/**
 * Adds a new script to the 'scripts' section of the 'package.json' file.
 *
 * @param {string} basePath - The path to the directory containing the 'package.json' file.
 * @param {string} scriptName - The name of the new script.
 * @param {string} script - The command that the new script should run.
 * @returns {void}
 */
export function addScriptToPackage(basePath, scriptName, script) {
    const packageJsonPath = path.join(basePath, 'package.json')
    const pkgFile = readFileSync(packageJsonPath, {
        encoding: 'utf-8',
    })
    const newPkg = JSON.parse(pkgFile)
    newPkg.scripts[scriptName] = script

    writeFileSync(packageJsonPath, JSON.stringify(newPkg, null, 4))
}
