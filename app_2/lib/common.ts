
declare interface Generator<TOut> {
    (): TOut;
}

declare interface Predicate<TIn> {
    (value: TIn): boolean;
}

