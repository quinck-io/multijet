# Core concepts

> Even if Multijet is an opinionated framework, thanks to its flexible structure it can be changed and modified to your specific needs.

In this section you will be introduced to the **main concepts** behind Multijet:
​​

-   OpenAPI-first approach
-   Libs and Microservice workspaces

The idea behind these concept is to have a **continuous development** flow by putting the **API design first** before the code and implementation.
Fig.1: Development flow of a Mulijet project.

---

# Workspaces

The main concept of Multijet is the same as every other Node.js based monorepo: **workspaces**.

To know more about workspaces, you can read the official [npm workspaces documentation]().

In Multijet, there are two workspaces by default:

-   **microservices**
-   **libs**

> Workspaces are defined in the project's root `package.json` file.

## Microservices

Inside this workspace by default there are **multiple Node.js** projects using the `Fastify` web framework. If you just created a new project, you will find an example microservice running a simple `hello-world` REST API.

By default, microservices can install and use shared packages in the `libs` workspace.

## Libs

As the `microservices` workspace, this one also can contain multiple Node.js projects. These packages can be installed and used either by a microservice or by another lib.

## Example structure

Let's say you have a project with the following structure:

```
my-project/
├── libs/
│   ├── lib-A
│   └── lib-B
└── microservices/
    └── microservice-1
```

For this example, we want to use `lib-A` in `microservice-1`, and `lib-B` in `lib-A`.

First, let's install `lib-B` as a dependency of `lib-A`. In the root of your project run this command:

```sh
npm install @libs/lib-B -w libs/lib-A
```

This command is a standard `npm install` but,
instaed of installing a package from the npm registry,
we actually add a local package (`lib-B`) contained in the **libs workspace**.

If we didn't include `-w libs/lib-A` npm would have installed
the package globally in the project. By using the `-w` option we tell
npm to install that package **for the specific package in the workspace**
(in this case the workspace is `libs` and the package is `lib-A`)

Now that we have installed `lib-B` in `lib-A`, you can probably guess how we can do this with `microservice-1` and `lib-A`:

```sh
npm install @libs/lib-A -w microservices/microservice-1
```

Note that the `-w` option is **not required** if you are already in
the directory of the project that needs the dependency:

```sh
cd microservices/microservice-1
npm install @libs/lib-A
```

This will do the same exact thing as the previous command.

---

# OpenAPI
The development flow of a Multijet project is based around the **OpenAPI definition file**, located in `configs/openapi.json`.

To know more about OpenAPI, head to the [official specification](https://spec.openapis.org/oas/v3.1.0).

> Multijet only supports OpenAPI version 3.1.0

## Code generation

To generate all the required models from the OpenAPI file, simply run this command in the root of your project:

```sh
npm run openapi:generate
```

This script will generate all the Typescript interfaces and models based on the API definition, including:

-   **Component schemas**
-   **Path and query params**
-   **Requests and responses body**
-   **Routes**

All the generated types are located in `libs/fastify-utils/src/generated` and can be used from anywhere by **importing** `@libs/fastify-utils`.
