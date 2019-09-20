
/**
 * Defines an internal type used to specify a JSON.
 */
export interface JsonType {
  [key: string]: JsonType | string | number | boolean | null | JsonType[] | string[] | number[] | boolean[];
}
