
/**
 * Defines the interface to describe the extractor for messages.
 */
export interface MessageTypeExtractorInterface {

  /**
   * Resolve the unique name of a message, e.g. the full class name.
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
  extract(message: any): Function | string;
}
