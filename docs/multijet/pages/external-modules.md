# External modules

Installing and using external **npm modules** is pretty easy.
Multijet uses **npm workspaces** to manage all the global and scoped dependencies.

## Global modules

If you install a package in the root of your directory, **every** project inside (lib or microservice) can use that package.

To install a global package in your project, simply run:

```sh
npm install <module-name>
```

This is useful to install modules that **all of your packages** depends on
(for example, Multijet installs by default Typescript globally so every package uses the same version).

## Scoped modules

Installing global modules is convenient but often you have a module used by **only one or few packages**.

To install a module for only one package simply run this command from the root of your project:

```sh
npm install <module-name> -w <workspace>/<package>
```

If for example we want to install the package `lodash` in the microservice `auth-service`, we can run the following command:

```sh
npm install lodash -w microservices/auth-service
```

Note that if you are already inside the target directory **you do not need** to use the `-w` option:

```sh
cd microservices/auth-service
npm install lodash
```

These commands will add the dependency **only to the specified workspace or package**.
The monorepo will handle all the module resolution and will share common modules **automatically**
to optimize the installation and disk usage.
