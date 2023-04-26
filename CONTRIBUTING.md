# Contributing to Multijet ⚡️

## Project structure

-   `/`: main Node.js project containing the CLI dependencies
-   `/cli`: directory containing the CLI entrypoint and files. Takes the dependencies from the root of the repository
-   `/core`: the core of multijet (Node.js monorepo), scaffolded in every new project created with the CLI
-   `/modules`: monorepo containing the optional modules (libs, microservices...)

---

## Core development

When working on the Multijet core you first need to install all the dependencies:

```bash
cd core && npm ci
```

Given that multijet scaffolds a Node monorepo, this command will install all the dependencies needed by libs or microservices on the root of the core.

Next, **build** the core to ensure the main components are working:

```bash
npm run build
```

## Optional modules development

To start working on an optional module:

```bash
cd modules
```

The modules monorepo picks the lib workspace from the multijet core so you can import and **use core libs on your optional modules**.

`modules/package.json`:

```json
...
"workspaces": [
        "libs/*",
        "../core/libs/*"
    ],
...
```

The modules project includes `mocha` and `chai` so you can test all the optional modules by running the following command:

```bash
npm run test
```

## CLI Development

To develop the CLI you just need to install the **root dependencies**:

```bash
npm ci
```

All the files are under the `/cli` folder.
The CLI entrypoint is specified at the `bin` property in the **root** `package.json` file:

```json
{
    "name": "multijet",
    "version": "1.0.0",
    "bin": "cli/main.js",
    "type": "module"
    ...
}
```

To try the CLI locally, in the root of the project run the following command:

```bash
npm i -g
```

This will install the CLI as a local module. You can now use it locally with `npx`:

```bash
npx multijet
```
