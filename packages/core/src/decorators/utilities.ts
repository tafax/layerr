
import 'reflect-metadata';
import { ClassType } from '../utilities/class-type';

const _getSymbol = <T>(key: string, classType: ClassType<T>): symbol => {
  return Object.getOwnPropertySymbols(classType.prototype)
    .find((symbol: symbol) => Symbol.keyFor(symbol) === key)
};

/**
 * Defines an utility function to understand if a class type is decorated.
 */
export function IsDecorated<T>(key: string, classType: ClassType<T>): boolean {
  return !!_getSymbol(key, classType);
}

/**
 * Defines an utility to read a metadata attached to the class type.
 */
export function GetValue<T, U>(key: string, classType: ClassType<T>): U {
  const symbol = _getSymbol(key, classType);
  return classType.prototype[symbol];
}
