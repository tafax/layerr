
import { LoggerLevel } from './logger.level.enum';
import { LoggerArgs, LoggerChannelInterface } from './channels/logger-channel.interface';

/**
 * Defines a custom logger service interface that should be imported each time the app
 * needs to deal with the log or it needs to dump some info.
 */
export interface LoggerInterface {

  /**
   * Returns the global minimum level set.
   */
  globalLevel: LoggerLevel;

  /**
   * Returns the channels for the logger.
   */
  channels: LoggerChannelInterface[];

  /**
   * Writes a message with the LOG level.
   * @param {string} message The message to write.
   * @param {LoggerArgs[]} args The arguments of the message.
   */
  log(message?: string, ...args: LoggerArgs[]);

  /**
   * Writes a message with the DEBUG level.
   * @param {string} message The message to write.
   * @param {LoggerArgs[]} args The arguments of the message.
   */
  debug(message?: string, ...args: LoggerArgs[]);

  /**
   * Writes a message with the DEBUG level.
   * @param {string} message The message to write.
   * @param {LoggerArgs[]} args The arguments of the message.
   */
  info(message?: string, ...args: LoggerArgs[]);

  /**
   * Writes a message with the WARN level.
   * @param {string} message The message to write.
   * @param {LoggerArgs[]} args The arguments of the message.
   */
  warn(message?: string, ...args: LoggerArgs[]);

  /**
   * Writes a message with the ERROR level.
   * @param {string} message The message to write.
   * @param {LoggerArgs[]} args The arguments of the message.
   */
  error(message?: string, ...args: LoggerArgs[]);

}
