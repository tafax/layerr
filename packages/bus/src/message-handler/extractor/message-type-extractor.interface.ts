
/**
 * Defines the interface to describe the extractor for messages.
 */
export interface MessageTypeExtractorInterface {

  /**
   * Resolve the unique name of a message, e.g. the full class name.
   */
  extract(message: any): Function | string;

}
