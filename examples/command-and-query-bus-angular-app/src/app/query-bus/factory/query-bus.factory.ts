
import { Injector, Inject } from '@angular/core';
import {
  CollectionHandlerLookup,
  FunctionConstructorMessageTypeExtractor,
  MessageMapper,
  MessageHandlerMiddleware,
  MessageHandlerPair
} from '@layerr/bus';
import { ServiceContainerClassResolver } from '@layerr/core';
import { QueryBusService } from '../service/query-bus.service';

import { QUERY_BUS_MESSAGE_MAPPING } from '../token/query-bus.mapping.token';

/**
 * Defines the factory class to instantiate a new command bus.
 */
export class QueryBusFactory {
  /**
   * Creates the query bus service. Why do we need injector?
   * We need it to resolve the handlers and allow them to be fulfilled
   * with their application dependencies.
   */
  static Create(
    @Inject(QUERY_BUS_MESSAGE_MAPPING) mapping: MessageHandlerPair[][],
    injector: Injector
  ): QueryBusService {

    // Flats the array of mappings.
    const flattenMapping = Array.prototype.concat(...mapping);

    /**
     * Creates the class map resolver. It is based on the mapping collection
     * and uses the extractor to know the command identifier (the class symbol in our case).
     * The service locator resolver allows to create the handler through the Angular DI.
     */
    const collection = new CollectionHandlerLookup(flattenMapping);
    const extractor = new FunctionConstructorMessageTypeExtractor();
    // tslint:disable-next-line
    const injectorResolver = new ServiceContainerClassResolver(injector);
    const classMapHandler = new MessageMapper(collection, extractor, injectorResolver);

    // Creates the bus with the needed middlewares.
    const messageHandlerMiddleware = new MessageHandlerMiddleware(classMapHandler);

    return new QueryBusService([ messageHandlerMiddleware ]);
  }
}
