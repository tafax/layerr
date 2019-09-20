
import { MessageTypeExtractorInterface } from './message-type-extractor.interface';

/**
 * Provides the ability to get the function constructor of an object.
 * At runtime, it can be considered the class of the object.
 */
export class FunctionConstructorMessageTypeExtractor implements MessageTypeExtractorInterface {

  /**
   * @inheritDoc
   */
  extract(message: any): Function {
    return (message as Object).constructor;
  }

}
