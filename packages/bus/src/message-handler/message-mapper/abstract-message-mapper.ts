
import { ClassType } from '@layerr/core';
import { HandlerLookupInterface } from '../handler-lookup/handler-lookup.interface';
import { MessageMapperInterface } from './message-mapper.interface';
import { MessageTypeExtractorInterface } from '../extractor/message-type-extractor.interface';

/**
 * Provides the ability to resolve a specific handler for a given message.
 * It is based on the message lookup and uses an extractor to
 * get the identifier of a message and then get handler identifier.
 */
export abstract class AbstractMessageMapper implements MessageMapperInterface {

  constructor(
    private _messageLookup: HandlerLookupInterface,
    private _extractor: MessageTypeExtractorInterface
  ) {
  }

  /**
   * @inheritDoc
   */
  protected _getHandlerIdentifier(message: any): any {
    // Extracts the identifier.
    const identifier = this._extractor.extract(message);
    // Gets the handler based on the message identifier.
    return <ClassType<any>>this._messageLookup.getValue(identifier);
  }

  /**
   * @inheritDoc
   */
  abstract getHandlers(message: any): Function[];

}
