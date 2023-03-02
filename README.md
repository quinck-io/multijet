# multijet

**Multijet** is a highly opinonated framework for building large **microservice based** monorepos in Typescript.

The core concept of multijet is the **microservices/libs** structure:

-   Each microservice is a separate Node.js project that uses the Fastify web framework
-   The packages included in the `libs/` folder also are separate Node.js projects can be imported and used either by a Microservice or by another **lib**.

Thanks to `turborepo` and `esbuild`, multijet can build and bundle all your microservices and their dependencies in a matter of milliseconds
