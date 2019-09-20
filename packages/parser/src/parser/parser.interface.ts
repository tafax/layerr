
import { JsonType } from '@swiss/core';

/**
 * Defines the interface to deal with a baseResponse
 * by converting the body to a valid object.
 */
export interface ParserInterface<T> {
  /**
   * Transforms the `content` and parses it creating a specific model object.
   * @param content The response content to handle.
   * @param originalModel (Optional) The model instance.
   * @returns The expected value. It is likely a model.
   */
  transformAndParse(content: JsonType, originalModel?: T): T;
}
