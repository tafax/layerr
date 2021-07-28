/**
 * Defines the interface to create a message handler-lookup to get
 * a handler based on a given message.
 */
export interface HandlerLookupInterface {
  /**
   * Performs a handler-lookup to get the handler given a message.
   */
  getValue(message: unknown): unknown;
}
