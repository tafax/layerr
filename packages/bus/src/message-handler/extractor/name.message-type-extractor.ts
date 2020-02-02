
import { ClassType } from "@layerr/core";
import { MessageTypeExtractorInterface } from './message-type-extractor.interface';
import { BusError } from "../../errors/bus.error";

/**
 * Provides the ability to get the name of an object.
 * At runtime, it calls a `name` property to retrieve this string.
 * It is used to represent the message and allow the collection
 * to retrieve the correct handler for it.
 */
export class NameMessageTypeExtractor implements MessageTypeExtractorInterface {

  /**
   * @inheritDoc
   */
  extract(message: any): Function | string {
    if (!(<ClassType<any>>message).name) {
      throw new BusError(`Unable to find the property 'name' in message: ${message}`);
    }

    return (<ClassType<any>>message).name;
  }

}
