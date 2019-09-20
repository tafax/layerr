
import { suite, test, Times, IMock, Mock } from '@layerr/test';
import { LoggerChannelInterface } from '../../src/services/logger/channels/logger-channel.interface';
import { Logger } from '../../src/services/logger/logger';
import { LoggerLevel } from '../../src/services/logger/logger.level.enum';

//@ts-ignore
@suite class LoggerUnitTests {

  private loggerService: Logger;
  private channelInterfaceMock: IMock<LoggerChannelInterface>;

  before() {

    this.channelInterfaceMock = Mock.ofType<LoggerChannelInterface>();

    this.loggerService = new Logger(
      LoggerLevel.INFO,
      [ this.channelInterfaceMock.object ]
    );
  }

  @test 'should return the global level'() {
    this.loggerService.globalLevel.should.be.equal(LoggerLevel.INFO);
  }

  @test 'should return the list of channels'() {
    this.loggerService.channels.should.be.eql([ this.channelInterfaceMock.object ]);
  }

  @test 'should log only the correct level - INFO'() {

    this.loggerService.log('message', 'arg1', 'arg2');
    this.loggerService.debug('message', 'arg1', 'arg2');
    this.loggerService.info('message', 'arg1', 'arg2');
    this.loggerService.warn('message', 'arg1', 'arg2');
    this.loggerService.error('message', 'arg1', 'arg2');

    this.channelInterfaceMock.verify(channel => channel.log("message", 'arg1', 'arg2'), Times.never());
    this.channelInterfaceMock.verify(channel => channel.debug("message", 'arg1', 'arg2'), Times.never());
    this.channelInterfaceMock.verify(channel => channel.info("message", 'arg1', 'arg2'), Times.once());
    this.channelInterfaceMock.verify(channel => channel.warn("message", 'arg1', 'arg2'), Times.once());
    this.channelInterfaceMock.verify(channel => channel.error("message", 'arg1', 'arg2'), Times.once());
  }

  @test 'should log only the correct level - OFF'() {

    this.loggerService = new Logger(
      LoggerLevel.OFF,
      [ this.channelInterfaceMock.object ]
    );

    this.loggerService.log('message', 'arg1', 'arg2');
    this.loggerService.debug('message', 'arg1', 'arg2');
    this.loggerService.info('message', 'arg1', 'arg2');
    this.loggerService.warn('message', 'arg1', 'arg2');
    this.loggerService.error('message', 'arg1', 'arg2');

    this.channelInterfaceMock.verify(channel => channel.log("message", 'arg1', 'arg2'), Times.never());
    this.channelInterfaceMock.verify(channel => channel.debug("message", 'arg1', 'arg2'), Times.never());
    this.channelInterfaceMock.verify(channel => channel.info("message", 'arg1', 'arg2'), Times.never());
    this.channelInterfaceMock.verify(channel => channel.warn("message", 'arg1', 'arg2'), Times.never());
    this.channelInterfaceMock.verify(channel => channel.error("message", 'arg1', 'arg2'), Times.never());
  }

  @test 'should log only the correct level - LOG'() {

    this.loggerService = new Logger(
      LoggerLevel.LOG,
      [ this.channelInterfaceMock.object ]
    );

    this.loggerService.log('message', 'arg1', 'arg2');
    this.loggerService.debug('message', 'arg1', 'arg2');
    this.loggerService.info('message', 'arg1', 'arg2');
    this.loggerService.warn('message', 'arg1', 'arg2');
    this.loggerService.error('message', 'arg1', 'arg2');

    this.channelInterfaceMock.verify(channel => channel.log("message", 'arg1', 'arg2'), Times.once());
    this.channelInterfaceMock.verify(channel => channel.debug("message", 'arg1', 'arg2'), Times.once());
    this.channelInterfaceMock.verify(channel => channel.info("message", 'arg1', 'arg2'), Times.once());
    this.channelInterfaceMock.verify(channel => channel.warn("message", 'arg1', 'arg2'), Times.once());
    this.channelInterfaceMock.verify(channel => channel.error("message", 'arg1', 'arg2'), Times.once());
  }

  @test 'should log only the correct level - DEBUG'() {

    this.loggerService = new Logger(
      LoggerLevel.DEBUG,
      [ this.channelInterfaceMock.object ]
    );

    this.loggerService.log('message', 'arg1', 'arg2');
    this.loggerService.debug('message', 'arg1', 'arg2');
    this.loggerService.info('message', 'arg1', 'arg2');
    this.loggerService.warn('message', 'arg1', 'arg2');
    this.loggerService.error('message', 'arg1', 'arg2');

    this.channelInterfaceMock.verify(channel => channel.log("message", 'arg1', 'arg2'), Times.never());
    this.channelInterfaceMock.verify(channel => channel.debug("message", 'arg1', 'arg2'), Times.once());
    this.channelInterfaceMock.verify(channel => channel.info("message", 'arg1', 'arg2'), Times.once());
    this.channelInterfaceMock.verify(channel => channel.warn("message", 'arg1', 'arg2'), Times.once());
    this.channelInterfaceMock.verify(channel => channel.error("message", 'arg1', 'arg2'), Times.once());
  }

}
