export type RecursiveKeyOf<TObj extends object> = {
    [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
        TObj[TKey],
        `${TKey}`
    >
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
    [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
        TObj[TKey],
        `['${TKey}']` | `.${TKey}`
    >
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<
    TValue,
    Text extends string,
> = TValue extends any[]
    ? Text
    : TValue extends object
    ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
    : Text

export type Optional<T> = T | undefined

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]

export type StringKeyOf<T> = Extract<keyof T, string>
