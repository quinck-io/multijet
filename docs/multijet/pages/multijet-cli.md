Multijet CLI

# Multijet CLI

The Multijet CLI can be very useful not only to create new projects but also to quickly generate code for existing projects.

## Create a new microservice

To generate a new sample microservice, open a terminal in the root of your project and run the following command:

```sh
npx multijet new-microservice <service-name>
```

This will generate a new hello-world microservice with the given name in the [microservices workspace]().
The command will also install all the basic dependencies needed by the service.

Once the script finishes you can test if everything went well by **building your project**:

```sh
npm run build
```

If there are no errors, you are ready to go 🎉

## Create a new lib

To generate a new sample lib the process is the same as of creating a microservice.
In the root of your project run the following command:

```sh
npx multijet new-lib <lib-name>
```

This will generate a new lib with the given name containing a simple hello-world function in the [libs workspace]().
The command will also install all the basic dependencies needed by the lib.
