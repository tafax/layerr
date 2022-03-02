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
    private readonly _messageLookup: HandlerLookupInterface,
    private readonly _extractor: MessageTypeExtractorInterface,
  ) {}

  /**
   * @inheritDoc
   */
  protected _getHandlerIdentifier(message: unknown): ClassType<unknown> {
    // Extracts the identifier.
    const identifier = this._extractor.extract(message);
    // Gets the handler based on the message identifier.
    return this._messageLookup.getValue(identifier) as ClassType<unknown>;
  }

  /**
   * @inheritDoc
   */
  //eslint-disable-next-line @typescript-eslint/ban-types
  abstract getHandlers(message: unknown): Function[];
}
