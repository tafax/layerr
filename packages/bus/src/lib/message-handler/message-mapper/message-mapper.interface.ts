/**
 * Describes an interface to build an handler resolver
 * on top of the messages that it receives as parameter.
 */
export interface MessageMapperInterface {
  /**
   * Gets the handler for a message.
   */
  //eslint-disable-next-line @typescript-eslint/ban-types
  getHandlers(message: unknown): Function[];
}
