import { LoggerArgs, LoggerChannelInterface } from './channels/logger-channel.interface';
import { LoggerInterface } from './logger.interface';
import { LoggerLevel, levelToString } from './logger.level.enum';

/**
 * Defines a custom logger that should be imported each time the app
 * needs to deal with the log or it needs to dump some info.
 */
export class Logger implements LoggerInterface {

  constructor(
    private _globalLevel: LoggerLevel,
    private _channels: LoggerChannelInterface[]
  ) {}

  /**
   * @inheritDoc
   */
  get globalLevel(): LoggerLevel {
    return this._globalLevel;
  }

  /**
   * @inheritDoc
   */
  get channels(): LoggerChannelInterface[] {
    return this._channels;
  }

  /**
   * Writes a message with the given level and arguments.
   * 
   * NOTE: Right now, we support just the console logging.
   * 
   * @param {LoggerLevel} level The level for the message.
   * @param {string} message The message to write.
   * @param {LoggerArgs[]} args The arguments of the message.
   * @private
   */
  private _write(level: LoggerLevel, message?: string, ...args: LoggerArgs[]): void {
    if (this._globalLevel === LoggerLevel.OFF || level < this._globalLevel) {
      return;
    }
    const levelName = levelToString(level);
    this._channels.forEach(
      (channel: LoggerChannelInterface) => channel[levelName](message, ...args)
    );
  }

  /**
   * @inheritDoc
   */
  log(message?: string, ...args: LoggerArgs[]): void {
    this._write(LoggerLevel.LOG, message, ...args);
  }

  /**
   * @inheritDoc
   */
  debug(message?: string, ...args: LoggerArgs[]): void {
    this._write(LoggerLevel.DEBUG, message, ...args);
  }

  /**
   * @inheritDoc
   */
  info(message?: string, ...args: LoggerArgs[]): void {
    this._write(LoggerLevel.INFO, message, ...args);
  }

  /**
   * @inheritDoc
   */
  warn(message?: string, ...args: LoggerArgs[]): void {
    this._write(LoggerLevel.WARN, message, ...args);
  }

  /**
   * @inheritDoc
   */
  error(message?: string, ...args: LoggerArgs[]): void {
    this._write(LoggerLevel.ERROR, message, ...args);
  }

}
