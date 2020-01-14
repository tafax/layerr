
import { MessageTypeExtractorInterface } from './message-type-extractor.interface';

/**
 * Defines an identity extractor that can be used to
 * return
 */
export class IdentityMessageTypeExtractor implements MessageTypeExtractorInterface {

  /**
   * @inheritDoc
   */
  extract(message: any): Function {
    return message;
  }

}
