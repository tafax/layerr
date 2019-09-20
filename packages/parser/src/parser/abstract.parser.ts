
import * as isArray from 'lodash/isArray';
import * as get from 'lodash/get';
import * as set from 'lodash/set';
import * as isEmpty from 'lodash/isEmpty';
import * as forEach from 'lodash/forEach';
import * as clone from 'lodash/clone';
import * as isUndefined from 'lodash/isUndefined';
import * as has from 'lodash/has';
import { JsonType } from '@swiss/core';
import { ParserInterface } from './parser.interface';

/**
 * Defines a Transformation type used to specify
 * a function to transform values.
 */
export type Transformation<T, U> = (value: T) => U;

/**
 * Provides the ability to parse a JSON and convert it
 * to the modules structure. It allows to handle transformations
 * for specific entries.
 */
export abstract class AbstractParser<T> implements ParserInterface<T> {

  /**
   * Defines a set of transformations.
   */
  private _transformations: { [index: string]: Transformation<any, any> } = {};

  /**
   * Applies a single transformation to a property or sub-property value.
   * If the property is nested into an array element, the transformation will be applied to each element property value.
   * @param {Json} object The object in which the value to transform is located.
   * @param {string[]} paths The array containing the relative paths to one or more nested array property.
   * Every path is relative to the previous one. The last string is the relative path to the value to transform.
   * @param {Transformation<any, any>} transformationFn The transformation function
   * to call in order to transform a value.
   * @example
   * let events = {
   *  events: [{
   *    persons: [
   *      {name:'pers1'},
   *      {name:'pers1'}
   *    ]}, {
   *    persons: [
   *      {name:'pers1'},
   *      {name:'pers1'}
   *    ]}
   *  ]};
   * _applyTransformation(events, ['events', 'persons', 'name'], (value) => { return value.toUpperCase(); });
   */
  private _applyTransformation(object: JsonType, paths: string[], transformationFn: Transformation<any, any>) {
    // Creates a safe copy of the paths in order to reuse it in the parent cycle.
    const pathsClone = clone(paths);

    const path = pathsClone.shift();
    const value = get(object, path, undefined);

    if (isUndefined(value)) {
      return;
    }

    if (!pathsClone.length) {
      // Apply the value transformation.
      set(object, path, transformationFn(value));
    } else if (isArray(value)) {
      // Nested sub-paths.
      forEach(value, (item: JsonType) => this._applyTransformation(item, pathsClone, transformationFn));
    }

  }

  /**
   * Applies the transformation to values of the given entity.
   * @param {Json} object The object where which extracting values to transform.
   */
  protected applyTransformations(object: JsonType) {
    forEach(this._transformations, (transformation: Transformation<any, any>, path: string) => {
      // Creates an array with all array sub-paths.
      const subPaths = path.split(/\[\]\./);
      this._applyTransformation(object, subPaths, transformation);
    });
  }

  /**
   * A helper method of a particular parser implementations that allows to correctly update the existing models' values.
   * @param content The source of the data for out model
   * @param model The model which we want to update
   * @param contentProperty The name of the property to look for in the source
   * @param [modelProperty=contentProperty] The name of the property to set in the model.
   */
  protected updateFromJSON(
    content: JsonType,
    model: T,
    contentProperty: string,
    modelProperty: string = contentProperty
  ) {
    if (has(content, contentProperty)) {
      // Transfers the value from the content to the model if it's defined in the content transforming null to undefined.
      const contentValue = get(content, contentProperty);
      const normalizedContent = contentValue !== null ? contentValue : undefined;
      // This calls the setter if available.
      set(model, modelProperty, normalizedContent);
    }
  }

  /**
   * Parses the content after the transformations.
   * @param content The content to parse.
   * @param [originalModel] The optional original model that must be updated with some fresh data.
   * @returns The parsed content.
   */
  protected abstract parse(content: JsonType, originalModel?: T): T;

  /**
   * Adds a new transformation function associated to a specific path.
   * @param path The path in the JSON which will be used to get the value to transform.
   * @param transformation The function to transform the value.
   * @example
   * addTransformation('price', transformationFn);
   * addTransformation('user.name', transformationFn);
   * addTransformation('patrons[].name', transformationFn);
   */
  addTransformation(path: string, transformation: Transformation<any, any>) {
    this._transformations[path] = transformation;
  }

  /**
   * Gets the transformations set.
   * @returns The transformations collection.
   */
  getTransformations(): { [index: string]: Transformation<any, any> } {
    return this._transformations;
  }

  /**
   * Transforms the `content` and then parses it using a particular parsing implementation.
   * @param content The content to transform and parse.
   * @param [originalModel] The optional original model that must be updated with some fresh data.
   * @returns The transformed and parsed content.
   */
  transformAndParse(content: JsonType, originalModel?: T): T {
    if (isEmpty(content)) {
      return;
    }
    this.applyTransformations(content);
    return this.parse(content, originalModel);
  }
}
