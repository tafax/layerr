/* istanbul ignore file */

import 'reflect-metadata';
import { ClassType } from '../utilities/class-type';
import { CTor } from '../utilities/ctor';
import { Decorator } from '../utilities/decorator';

export function createOptionsDecorator<T, U extends ClassType<unknown>>(key: string): Decorator<T, U> {
  return (options: T): CTor<U> => {
    return (target: U): U => {
      Object.defineProperty(
        target.prototype,
        Symbol.for(key),
        {
          enumerable: false,
          configurable: false,
          writable: false,
          value: options,
        },
      );
      return target;
    };
  }
}

export function createOptionsDecoratorCustomBehavior<T, U extends ClassType<unknown>>(
  action: (options: T, target: U) => void,
): Decorator<T, U> {
  return (options: T): CTor<U> => {
    return (target: U): U => {
      action(options, target);
      return target;
    };
  }
}
