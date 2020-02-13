
// Defines a set of types for the logger args.
export declare type LoggerArgs = string | number | boolean | Record<string, any>;

/**
 * Defines a generic channel to physically write a log.
 */
export interface LoggerChannelInterface {

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
