/**
 * Defines an internal type used to specify a class type.
 */
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassType<T> = new (...args: any[]) => T;
