import { ReactNode } from 'react';
import { RecordJSON } from './interface.js';

export type StringMap = { [key: string]: any };
export interface TOptionsBase {
  /**
   * Default value to return if a translation was not found
   */
  defaultValue?: any;
  /**
   * Count value used for plurals
   */
  count?: number;
  /**
   * Used for contexts (eg. male\female)
   */
  context?: any;
  /**
   * Object with vars for interpolation - or put them directly in options
   */
  replace?: any;
  /**
   * Override language to use
   */
  lng?: string;
  /**
   * Override languages to use
   */
  lngs?: readonly string[];
  /**
   * Override language to lookup key if not found see fallbacks for details
   */
  fallbackLng?: any;
  /**
   * Override namespaces (string or array)
   */
  ns?: string | readonly string[];
  /**
   * Override char to separate keys
   */
  keySeparator?: false | string;
  /**
   * Override char to split namespace from key
   */
  nsSeparator?: false | string;
  /**
   * Accessing an object not a translation string (can be set globally too)
   */
  returnObjects?: boolean;
  /**
   * Returns an object that includes information about the used language, namespace, key and value
   */
  returnDetails?: boolean;
  /**
   * Char, eg. '\n' that arrays will be joined by (can be set globally too)
   */
  joinArrays?: string;
  /**
   * String or array of postProcessors to apply see interval plurals as a sample
   */
  postProcess?: string | readonly string[];
  /**
   * Override interpolation options
   */
  interpolation?: any;
}
export type TOptions<
  TInterpolationMap extends Record<string, unknown> = StringMap
> = TOptionsBase & TInterpolationMap;
export type NoticeMessage = {
  message: string;
  // Extra 'error' to handle backwards. Error is replaced to danger in notification box
  type?: string;
  options?: TOptions;
  resourceId?: string;
  body?: ReactNode;
};
/**
 * ActionRequest
 * @memberof Action
 * @alias ActionRequest
 */
export type ActionRequest = {
  /**
   * parameters passed in an URL
   */
  params: {
    /**
     * Id of current resource
     */
    resourceId: string;
    /**
     * Id of current record (in case of record action)
     */
    recordId?: string;
    /**
     * Id of selected records (in case of bulk action) divided by commas
     */
    recordIds?: string;
    /**
     * Name of an action
     */
    action: string;
    /**
     * an optional search query string (for `search` resource action)
     */
    query?: string;

    [key: string]: any;
  };
  /**
   * POST data passed to the backend
   */
  payload?: Record<string, any>;
  /**
   * Elements of query string
   */
  query?: Record<string, any>;
  /**
   * HTTP method
   */
  method: 'post' | 'get';
};

/**
 * Base response for all actions
 * @memberof Action
 * @alias ActionResponse
 */
export type ActionResponse = {
  /**
   * Notice message which should be presented to the end user after showing the action
   */
  notice?: NoticeMessage;
  /**
   * redirect path
   */
  redirectUrl?: string;
  /**
   * Any other custom parameter
   */
  [key: string]: any;
};

/**
 * Required response of a Record action. Extends {@link ActionResponse}
 *
 * @memberof Action
 * @alias RecordActionResponse
 */
export type RecordActionResponse = ActionResponse & {
  /**
   * Record object.
   */
  record: RecordJSON;
};

/**
 * Required response of a Record action. Extends {@link ActionResponse}
 *
 * @memberof Action
 * @alias RecordActionResponse
 */
export type BulkActionResponse = ActionResponse & {
  /**
   * Array of RecordJSON objects.
   */
  records: Array<RecordJSON>;
};
