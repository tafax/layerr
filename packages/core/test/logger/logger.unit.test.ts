import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { mock, instance, verify } from 'ts-mockito';
import { LoggerChannelInterface } from '../../src/lib/services/logger/channels/logger-channel.interface';
import { Logger } from '../../src/lib/services/logger/logger';
import { LoggerLevel } from '../../src/lib/services/logger/logger.level.enum';

@suite class LoggerUnitTest {

  @test whenGetGlobalLevel_thenReturnIt() {
    const channelInterface = mock<LoggerChannelInterface>();

    const SUT = new Logger(
      LoggerLevel.INFO,
      [ instance(channelInterface) ],
    );

    expect(SUT.globalLevel).toStrictEqual(LoggerLevel.INFO);
  }

  @test whenGetChannels_thenReturnThem() {
    const channelInterface = mock<LoggerChannelInterface>();

    const SUT = new Logger(
      LoggerLevel.INFO,
      [ instance(channelInterface) ],
    );

    expect(SUT.channels).toHaveLength(1);
  }

  @test givenLevelInfo_whenLogging_thenCallCorrectChannelsMethod() {
    const channelInterface = mock<LoggerChannelInterface>();

    const SUT = new Logger(
      LoggerLevel.INFO,
      [ instance(channelInterface) ],
    );

    SUT.log('message', 'arg1', 'arg2');
    SUT.debug('message', 'arg1', 'arg2');
    SUT.info('message', 'arg1', 'arg2');
    SUT.warn('message', 'arg1', 'arg2');
    SUT.error('message', 'arg1', 'arg2');

    verify(channelInterface.log('message', 'arg1', 'arg2')).never();
    verify(channelInterface.debug('message', 'arg1', 'arg2')).never();
    verify(channelInterface.info('message', 'arg1', 'arg2')).once();
    verify(channelInterface.warn('message', 'arg1', 'arg2')).once();
    verify(channelInterface.error('message', 'arg1', 'arg2')).once();
  }

  @test givenLevelOff_whenLogging_thenNeverCallChannels() {
    const channelInterface = mock<LoggerChannelInterface>();

    const SUT = new Logger(
      LoggerLevel.OFF,
      [ instance(channelInterface) ],
    );

    SUT.log('message', 'arg1', 'arg2');
    SUT.debug('message', 'arg1', 'arg2');
    SUT.info('message', 'arg1', 'arg2');
    SUT.warn('message', 'arg1', 'arg2');
    SUT.error('message', 'arg1', 'arg2');

    verify(channelInterface.log('message', 'arg1', 'arg2')).never();
    verify(channelInterface.debug('message', 'arg1', 'arg2')).never();
    verify(channelInterface.info('message', 'arg1', 'arg2')).never();
    verify(channelInterface.warn('message', 'arg1', 'arg2')).never();
    verify(channelInterface.error('message', 'arg1', 'arg2')).never();
  }

  @test givenLevelLog_whenLogging_thenCallChannels() {
    const channelInterface = mock<LoggerChannelInterface>();

    const SUT = new Logger(
      LoggerLevel.LOG,
      [ instance(channelInterface) ],
    );

    SUT.log('message', 'arg1', 'arg2');
    SUT.debug('message', 'arg1', 'arg2');
    SUT.info('message', 'arg1', 'arg2');
    SUT.warn('message', 'arg1', 'arg2');
    SUT.error('message', 'arg1', 'arg2');

    verify(channelInterface.log('message', 'arg1', 'arg2')).once();
    verify(channelInterface.debug('message', 'arg1', 'arg2')).once();
    verify(channelInterface.info('message', 'arg1', 'arg2')).once();
    verify(channelInterface.warn('message', 'arg1', 'arg2')).once();
    verify(channelInterface.error('message', 'arg1', 'arg2')).once();
  }

  @test givenLevelDebug_whenLogging_thenCallCorrectChannels() {
    const channelInterface = mock<LoggerChannelInterface>();

    const SUT = new Logger(
      LoggerLevel.DEBUG,
      [ instance(channelInterface) ],
    );

    SUT.log('message', 'arg1', 'arg2');
    SUT.debug('message', 'arg1', 'arg2');
    SUT.info('message', 'arg1', 'arg2');
    SUT.warn('message', 'arg1', 'arg2');
    SUT.error('message', 'arg1', 'arg2');

    verify(channelInterface.log('message', 'arg1', 'arg2')).never();
    verify(channelInterface.debug('message', 'arg1', 'arg2')).once();
    verify(channelInterface.info('message', 'arg1', 'arg2')).once();
    verify(channelInterface.warn('message', 'arg1', 'arg2')).once();
    verify(channelInterface.error('message', 'arg1', 'arg2')).once();
  }
}
