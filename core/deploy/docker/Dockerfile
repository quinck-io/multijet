# The builder image.
ARG FROM_DOCKER_IMAGE

FROM $FROM_DOCKER_IMAGE AS builder
ARG MICROSERVICE
ARG ENTRYPOINT="main"

# Set the working directory.
WORKDIR /app

# Copy all.
COPY . .

# Install dependencies.
RUN npm i turbo esbuild
RUN npm i

# Build the microservice.
# RUN npm run openapi:generate
RUN npm run build:nocache -- --filter=${MICROSERVICE} -- ${ENTRYPOINT} main

# # Set the working directory for the particular microservice.
WORKDIR /app/microservices/${MICROSERVICE}

# Production image.
FROM $FROM_DOCKER_IMAGE
ARG MICROSERVICE

# Set the working directory.
WORKDIR /app

# Copy the bundle from the builder image.
COPY --from=builder /app/microservices/${MICROSERVICE}/dist ./

EXPOSE 3000

CMD [ "node", "main.js" ]