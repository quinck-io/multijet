# minimal

## Tech stack

-   npm workspaces
-   Turborepo
-   esbuild

## Get started

Install all workspaces and packages dependencies:

```bash
npm ci
```

Build the monorepo:

```bash
npm run build
```

## Useful commands

-   `npm run build`: builds all the packages
-   `npm run clean`: deletes all build, node_modules and temporary folders
-   `npm run ts <file>`: runs an arbitrary TypeScript file using ESR
