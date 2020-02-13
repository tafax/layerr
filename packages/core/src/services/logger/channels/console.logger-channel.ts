
/* istanbul ignore file */

import { LoggerArgs, LoggerChannelInterface } from './logger-channel.interface';

/**
 * Represents the common console channel.
 */
export class ConsoleLoggerChannel implements LoggerChannelInterface {

  /**
   * @inheritDoc
   */
  log(message?: string, ...args: LoggerArgs[]): void {
    console.log(message, ...args);
  }

  /**
   * @inheritDoc
   */
  debug(message?: string, ...args: LoggerArgs[]): void {
    console.debug(message, ...args);
  }

  /**
   * @inheritDoc
   */
  info(message?: string, ...args: LoggerArgs[]): void {
    console.info(message, ...args);
  }

  /**
   * @inheritDoc
   */
  warn(message?: string, ...args: LoggerArgs[]): void {
    console.warn(message, ...args);
  }

  /**
   * @inheritDoc
   */
  error(message?: string, ...args: LoggerArgs[]): void {
    console.error(message, ...args);
  }
}
