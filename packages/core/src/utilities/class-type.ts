
/**
 * Defines an internal type used to specify a class type.
 */
export type ClassType<T> = new (...args: any[]) => T;
