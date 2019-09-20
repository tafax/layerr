/**
 * Declare a type that allows to specify a type based on another one.
 */
export declare type Properties<T> = { [P in keyof T]: T[P] };
