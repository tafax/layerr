/**
 * Defines the levels for the logging.
 */
export enum LoggerLevel {
  OFF = 0, // No log will be written.
  LOG,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

/**
 * Converts a logger level into a convenience string.
 * @param {LoggerLevel} level
 * @returns {string} The name of the level.
 */
export function levelToString(level: LoggerLevel): string {
  switch (level) {
    case 1: return 'log';
    case 2: return 'debug';
    case 3: return 'info';
    case 4: return 'warn';
    case 5: return 'error';
  }
}
