
import { MessageTypeExtractorInterface } from './message-type-extractor.interface';

/**
 * Provides the ability to get the message as itself.
 * It is used to represent the message and allow the collection
 * to retrieve the correct handler for it.
 */
export class IdentityMessageTypeExtractor implements MessageTypeExtractorInterface {

  /**
   * @inheritDoc
   */
  extract(message: any): Function | string {
    return message;
  }

}
