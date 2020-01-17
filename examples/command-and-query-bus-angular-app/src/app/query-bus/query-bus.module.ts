
import { NgModule, Injector } from '@angular/core';
import { QUERY_MAPPING_COLLECTION } from './query-bus.config';
import { QueryBusFactory } from './factory/query-bus.factory';
import { TestQueryHandler } from './query-handler/test.query-handler';
import { QueryBusService } from './service/query-bus.service';
import { QUERY_BUS_MESSAGE_MAPPING } from './token/query-bus.mapping.token';

@NgModule({
  providers: [
    TestQueryHandler,
    {
      provide: QueryBusService,
      useFactory: QueryBusFactory.Create,
      deps: [ QUERY_BUS_MESSAGE_MAPPING, Injector ]
    },
    {
      provide: QUERY_BUS_MESSAGE_MAPPING,
      useValue: QUERY_MAPPING_COLLECTION,
      multi: true
    }
  ]
})
export class QueryBusModule {}
