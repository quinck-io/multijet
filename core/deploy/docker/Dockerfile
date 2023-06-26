# The builder image.
FROM node:18-alpine as builder
ARG MICROSERVICE
ARG ENTRYPOINT="main"

# Set the working directory.
WORKDIR /app

# Copy all.
COPY . .

# Install dependencies.
RUN npm install turbo
RUN npm ci

# Build the microservice.
RUN npm run build -- --filter=${MICROSERVICE} -- ${ENTRYPOINT} main

# # Set the working directory for the particular microservice.
WORKDIR /app/microservices/${MICROSERVICE}

# Production image.
FROM node:18-alpine
ARG MICROSERVICE

# Set the working directory.
WORKDIR /app

# Copy the bundle from the builder image.
COPY --from=builder /app/microservices/${MICROSERVICE}/dist ./

EXPOSE 3000

CMD [ "node", "main.js" ]