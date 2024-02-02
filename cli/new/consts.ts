export type Namespace = "microservices" | "libs" | "packages"

export const templates: Record<Namespace, string> = {
    microservices: "microservice",
    libs: "lib",
    packages: "package",
}
