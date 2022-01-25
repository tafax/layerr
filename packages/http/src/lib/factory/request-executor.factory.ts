/* istanbul ignore file */

import {
  CollectionHandlerLookup,
  FunctionConstructorMessageTypeExtractor,
  MessageBus,
  MessageMapper,
  MessageHandlerPair,
} from '@layerr/bus';
import {
  ServiceContainerClassResolver,
  ServiceContainerInterface,
  LoggerInterface,
  Logger,
  LoggerLevel,
  ConsoleLoggerChannel,
} from '@layerr/core';
import { HttpAdapterInterface } from '../adapter/http-adapter.interface';
import { ErrorExecutionBusMiddleware } from '../middleware/error-execution.bus-middleware';
import { RequestExecutionBusMiddleware } from '../middleware/request-execution.bus-middleware';
import { RequestHandlerBusMiddleware } from '../middleware/request-handler.bus-middleware';
import { RequestExecutor } from '../service/request-executor';

export class RequestExecutorFactory {
  static Create(
    baseHost: string,
    mapping: MessageHandlerPair<unknown>[],
    serviceContainer: ServiceContainerInterface,
    httpAdapter: HttpAdapterInterface,
    retryAttemptCount?: number,
    retryDelay?: number,
    timeout?: number,
    logger?: LoggerInterface,
  ): RequestExecutor {
    const collection = new CollectionHandlerLookup(mapping);

    const extractor = new FunctionConstructorMessageTypeExtractor();
    const containerResolver = new ServiceContainerClassResolver(serviceContainer);

    const classMapHandler = new MessageMapper(collection, extractor, containerResolver);

    const errorExecutionBusMiddleware = new ErrorExecutionBusMiddleware(
      logger || new Logger(LoggerLevel.ERROR, [ new ConsoleLoggerChannel() ]),
    );
    const requestExecutionBusMiddleware = new RequestExecutionBusMiddleware(httpAdapter);
    const requestHandlerBusMiddleware = new RequestHandlerBusMiddleware(classMapHandler);

    const messageBus = new MessageBus([
      errorExecutionBusMiddleware,
      requestExecutionBusMiddleware,
      requestHandlerBusMiddleware,
    ]);

    return new RequestExecutor(
      baseHost,
      retryAttemptCount || null,
      retryDelay || 0,
      timeout || 60000, // Set a timeout of 60 seconds
      messageBus,
    );
  }
}
