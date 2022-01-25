import { createOptionsDecoratorCustomBehavior } from '@layerr/core';
import { ClassDecoratorHandlerLookup } from '../message-handler/handler-lookup/decorator/class-decorator.handler-lookup';

export const Handle = createOptionsDecoratorCustomBehavior(
  // TODO: Right now the ClassType is not compatible
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  (message: any, handler: any) => ClassDecoratorHandlerLookup.Register(message, handler),
);
