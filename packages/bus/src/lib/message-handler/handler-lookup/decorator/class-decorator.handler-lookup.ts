import { ClassType } from '@layerr/core';
import { BusError } from '../../../errors/bus.error';
import { HandlerLookupInterface } from '../handler-lookup.interface';

export class ClassDecoratorHandlerLookup implements HandlerLookupInterface {
  /**
   * The registry used for handling the mapping between message and handler
   */
  private static readonly REGISTRY = new Map<ClassType<unknown>, ClassType<unknown>>();

  /**
   * Saves the pair of message and handler in the registry
   */
  static Register(message: ClassType<unknown>, handler: ClassType<unknown>): void {
    ClassDecoratorHandlerLookup.REGISTRY.set(message, handler);
  }

  /**
   * @inheritDoc
   */
  getValue(message: ClassType<unknown>): ClassType<unknown> {
    if (!ClassDecoratorHandlerLookup.REGISTRY.has(message)) {
      throw new BusError('Unable to find an entry for the message. Are you sure you added the "handle" decorator?');
    }
    return ClassDecoratorHandlerLookup.REGISTRY.get(message);
  }
}
