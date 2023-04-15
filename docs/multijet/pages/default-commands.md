# Default commands

A Multijet project, by default, contains serveral **npm scripts** that are very useful to manage, build and deploy your project.

All of the scripts are defined in the **global** `package.json` file (head to to the [Project configuration section]() know more).

Here are the main scripts that you will be using the most:

-   **build**: performs typechecking on all packages and bundles each microservice
-   **lint**: runs eslint for every package
-   **test**: runs all of your unit tests with mocha
-   **clean**: deletes all compiled files, cache and node modules
-   **sam:start**: builds your project and starts all the microservices with AWS Lambda
-   **ts**: runs a single TypeScript file (`.ts`) directly using `esbuild-runner`
