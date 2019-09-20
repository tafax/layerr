
import { MessageBus } from '@swiss/bus';
import {
  ClassResolverInterface,
  MetadataResolverInterface,
  DecoratorMetadataResolver,
  LoggerLevel,
  Logger,
  LoggerInterface,
  ConsoleLoggerChannel
} from '@swiss/core';
import { RequestServiceDecoratorsKeys } from '../decorators/request-service-decorators.keys';
import { RemoteCallHandlerBusMiddleware } from '../middlewares/remote-call-handler.bus-middleware';
import { HttpAdapterInterface } from '../service/adapter/http-adapter.interface';
import { ErrorExecutionBusMiddleware } from '../middlewares/error-execution.bus-middleware';
import { SchedulingExecutionBusMiddleware } from '../middlewares/scheduling-execution.bus-middleware';
import { RequestService } from '../service/request.service';

export class RequestServiceFactory {

  static Create(
    classResolver: ClassResolverInterface,
    adapter: HttpAdapterInterface,
    extractor?: MetadataResolverInterface,
    logger?: LoggerInterface
  ): RequestService {

    extractor = extractor || new DecoratorMetadataResolver(RequestServiceDecoratorsKeys.REMOTE_CALL_OPTIONS);

    /* istanbul ignore next */
    logger = logger || new Logger(LoggerLevel.WARN, [ new ConsoleLoggerChannel() ]);

    const executionBus = new MessageBus();
    executionBus.appendMiddleware(new ErrorExecutionBusMiddleware(logger));
    executionBus.appendMiddleware(new SchedulingExecutionBusMiddleware(classResolver, extractor, adapter, logger));
    executionBus.appendMiddleware(new RemoteCallHandlerBusMiddleware(classResolver, logger));

    return new RequestService(executionBus);

  }

}
