
import { MessageTypeExtractorInterface } from './message-type-extractor.interface';

/**
 * Provides the ability to get the function constructor of an object.
 * At runtime, it can be considered the class of the object.
 * It is used to represent the message and allow the collection
 * to retrieve the correct handler for it.
 */
export class FunctionConstructorMessageTypeExtractor implements MessageTypeExtractorInterface {

  /**
   * @inheritDoc
   */
  extract(message: any): Function | string {
    return (message as Record<string, any>).constructor;
  }

}
