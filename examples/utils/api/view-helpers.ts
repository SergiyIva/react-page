/**
 * Base Params for a any function
 * @alias ActionParams
 * @memberof ViewHelpers
 */
export type ActionParams = {
  /**
   * Unique Resource ID
   */
  resourceId: string;
  /**
   * Action name
   */
  actionName: string;
  /**
   * Optional query string: ?....
   */
  search?: string;
};

/**
 * Params for a record action
 * @alias RecordActionParams
 * @extends ActionParams
 * @memberof ViewHelpers
 */
export type RecordActionParams = ActionParams & {
  /**
   * Record ID
   */
  recordId: string;
};

/**
 * Params for a bulk action
 * @alias BulkActionParams
 * @extends ActionParams
 * @memberof ViewHelpers
 */
export type BulkActionParams = ActionParams & {
  /**
   * Array of Records ID
   */
  recordIds?: Array<string>;
};

/**
 * Params for a resource action
 * @alias ResourceActionParams
 * @extends ActionParams
 * @memberof ViewHelpers
 */
export type ResourceActionParams = ActionParams;
