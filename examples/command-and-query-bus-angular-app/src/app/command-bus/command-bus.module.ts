
import { NgModule, Injector } from '@angular/core';
import { COMMAND_MAPPING_COLLECTION } from './command-bus.config';
import { TestCommandHandler } from './command-handler/test.command-handler';
import { CommandBusFactory } from './factory/command-bus.factory';
import { CommandBusService } from './service/command-bus.service';
import { COMMAND_BUS_MESSAGE_MAPPING } from './token/command-bus.mapping.token';

@NgModule({
  providers: [
    TestCommandHandler,
    {
      provide: CommandBusService,
      useFactory: CommandBusFactory.Create,
      deps: [ COMMAND_BUS_MESSAGE_MAPPING, Injector ]
    },
    {
      provide: COMMAND_BUS_MESSAGE_MAPPING,
      useValue: COMMAND_MAPPING_COLLECTION,
      multi: true
    }
  ]
})
export class CommandBusModule {}
