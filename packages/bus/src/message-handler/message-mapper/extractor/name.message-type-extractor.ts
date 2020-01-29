
import { ClassType } from "@layerr/core";
import { MessageTypeExtractorInterface } from './message-type-extractor.interface';
import { BusError } from "../../../errors/bus.error";

/**
 * Defines an identity extractor that can be used to
 * return
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
