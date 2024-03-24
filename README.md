# multijet

![Logo](https://github.com/quinck-io/multijet/assets/119496044/5e2ee862-de17-4801-a1f7-186c6bd678fc)

**Multijet** is a highly opinonated framework for building large **microservice based** monorepos in Typescript.

The core concept of multijet is the **microservices/libs** structure:

-   Each microservice is a separate Node.js project usually based on the `Fastify` web framework.
-   The packages included in the `libs/` folder also are separate Node.js projects can be imported and used either by a Microservice or by another **lib**.

Thanks to `turborepo` and `esbuild`, multijet can build and bundle all your microservices and their dependencies in a matter of milliseconds

To get started, head to the [official documentation](https://quinck.gitbook.io/multijet/).

## Features

-   Extremely fast builds
-   OpenAPI-first design
-   Modular and flexible
-   Multiple deploy methods (AWS Lambda and Docker by default)
-   Easily configurable
-   Single file bundled microservices
-   Optional Jenkins pipeline and SonarCloud

💙 If you wish to contribute, check out [CONTRIBUTING.md](./CONTRIBUTING.md)
