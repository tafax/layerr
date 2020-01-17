
import { TestCommand } from '../command/test.command';

export class TestCommandHandler {

  handle(command: TestCommand) {
    console.log('TEST COMMAND');
  }

}
