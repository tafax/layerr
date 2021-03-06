
// Adding the polyfills.
import 'ts-polyfill/lib/es2015-core';
import 'ts-polyfill/lib/es2015-promise';
import 'ts-polyfill/lib/es2015-collection';

// Bus
export { MessageBusInterface } from './bus/message-bus.interface';
export { MessageBus } from './bus/message-bus';
export { MessageBusMiddlewareInterface } from './bus/middleware/message-bus-middleware.interface';

// Error
export { BusError } from './errors/bus.error';

// Decorator
export { Handler } from './decorator/handler';

// Lookup
export { HandlerLookupInterface } from './message-handler/handler-lookup/handler-lookup.interface';

// Collections
export { CollectionHandlerLookup } from './message-handler/handler-lookup/collection/collection.handler-lookup';
export { ConcurrentCollectionHandlerLookup } from './message-handler/handler-lookup/collection/concurrent-collection.handler-lookup';
export { MessageHandlerPair } from './message-handler/handler-lookup/collection/abstract-collection.handler-lookup';

// Decorator
export { DecoratorHandlerLookup } from './message-handler/handler-lookup/decorator/decorator.handler-lookup';

// Extractor
export { MessageTypeExtractorInterface } from './message-handler/extractor/message-type-extractor.interface';
export { FunctionConstructorMessageTypeExtractor } from './message-handler/extractor/function-constructor.message-type-extractor';
export { IdentityMessageTypeExtractor } from './message-handler/extractor/identity.message-type-extractor';

// Message mapper
export { MessageMapperInterface } from './message-handler/message-mapper/message-mapper.interface';
export { MessageMapper } from './message-handler/message-mapper/message.mapper';

// Message Handler
export { MessageHandlerMiddleware } from './message-handler/message-handler.middleware';

// Factory
export { GeneralPurposeBusFactory } from './factory/general-purpose-bus.factory';
