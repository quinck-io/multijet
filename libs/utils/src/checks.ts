export function isPresent<T>(x?: T | null): x is NonNullable<T> {
    return x != undefined && x != null
}
