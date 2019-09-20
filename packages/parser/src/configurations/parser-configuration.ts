
import { ClassType } from '@swiss/core';
import { AbstractParser, Transformation } from '../parser/abstract.parser';

/**
 * Defines the parser configuration passed as parameter
 * using decorators.
 */
export class ParserConfiguration<T> {

  /**
   * Parser class to instantiate.
   */
  parser: ClassType<AbstractParser<T>>;

  /**
   * The content property in the JSON. If present.
   */
  contentProperty?: string;

  /**
   * The list property if the response is a list.
   */
  listProperty?: string;

  /**
   * The pagination property if the response is a list.
   */
  paginationProperty?: string;

  /**
   * The transformers to use with the JSON properties.
   */
  transformers?: { [index: string]: Transformation<any, any> };

}
