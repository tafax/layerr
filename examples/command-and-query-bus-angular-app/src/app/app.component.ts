import { Component } from '@angular/core';
import { TestCommand } from './command-bus/command/test.command';
import { CommandBusService } from './command-bus/service/command-bus.service';
import { TestQueryResult } from './query-bus/query-result/test.query-result';
import { TestQuery } from './query-bus/query/test.query';
import { QueryBusService } from './query-bus/service/query-bus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'command-and-query-bus-angular-app';

  constructor(
    private commandBusService: CommandBusService,
    private queryBusService: QueryBusService
  ) {
    // Just call the command. It shouldn't return anything by design.
    this.commandBusService.handle(new TestCommand());

    this.queryBusService.handle(new TestQuery())
      .subscribe(
        (results: TestQueryResult[]) => { console.log('Query result:', results[0].something); }
      );
  }

}
