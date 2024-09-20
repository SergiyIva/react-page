import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

import type {
  ActionParams,
  BulkActionParams,
  RecordActionParams,
  ResourceActionParams,
} from './view-helpers.js';
import type { RecordJSON } from './interface.js';
import type {
  ActionResponse,
  BulkActionResponse,
  RecordActionResponse,
} from './action.interface.js';

let globalAny: any = {};

try {
  globalAny = window;
} catch (error) {
  if (!(error instanceof ReferenceError)) {
    throw error;
  } else {
    globalAny = { isOnServer: true };
  }
} finally {
  if (!globalAny) {
    globalAny = { isOnServer: true };
  }
}

/**
 * Type of an [axios request]{@link https://github.com/axios/axios/blob/master/index.d.ts#L43}
 *
 * @typedef {object} AxiosRequestConfig
 * @alias AxiosRequestConfig
 * @memberof ApiClient
 * @see https://github.com/axios/axios/blob/master/index.d.ts#L43
 */

const checkResponse = (response: AxiosResponse): void => {
  return;
};

/**
 * Extends {@link AxiosRequestConfig}
 *
 * @alias ActionAPIParams
 * @memberof ApiClient
 * @property {any}   ...    any property supported by {@link AxiosRequestConfig}
 */
export type ActionAPIParams = AxiosRequestConfig & ActionParams;

/**
 * Extends {@link ActionAPIParams}
 *
 * @alias ResourceActionAPIParams
 * @memberof ApiClient
 * @property {any}   ...    any property supported by {@link AxiosRequestConfig}
 */
export type ResourceActionAPIParams = AxiosRequestConfig &
  ResourceActionParams & {
    query?: string;
  };
/**
 * Extends {@link ActionAPIParams}
 *
 * @alias RecordActionAPIParams
 * @memberof ApiClient
 * @property {any}   ...    any property supported by {@link ActionAPIParams}
 */
export type RecordActionAPIParams = AxiosRequestConfig & RecordActionParams;

/**
 * Extends {@link ActionAPIParams}
 *
 * @alias BulkActionAPIParams
 * @memberof ApiClient
 * @see https://github.com/axios/axios/blob/master/index.d.ts#L43
 * @property {any}   ...    any property supported by {@link ActionAPIParams}
 */
export type BulkActionAPIParams = AxiosRequestConfig & BulkActionParams;

/**
 * Client which access the admin API.
 * Use it to fetch data from auto generated AdminJS API.
 *
 * In the backend it uses [axios](https://github.com/axios/axios) client
 * library.
 *
 * Usage:
 * ```javascript
 * import { ApiClient } from './api-client.js'
 *
 * const api = new ApiClient("http://localhos", "test")
 * // fetching all records
 * api.resourceAction({ resourceId: 'Comments', actionName: 'list' }).then(results => {...})
 * ```
 * @see https://github.com/axios/axios
 * @hideconstructor
 */
class ApiClient {
  private baseURL: string;

  private client: AxiosInstance;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'x-api-key': apiKey,
      },
    });
  }

  /**
   * Search by query string for records in a given resource.
   *
   * @param   {Object}  options
   * @param   {String}  options.resourceId     id of a {@link ResourceJSON}
   * @param   {String}  options.query          query string
   * @param   {String}  options.searchProperty optional property name
   *
   * @return  {Promise<SearchResponse>}
   */
  async searchRecords({
    resourceId,
    query,
    searchProperty,
  }: {
    resourceId: string;
    query: string;
    searchProperty?: string;
  }): Promise<Array<RecordJSON>> {
    if (globalAny.isOnServer) {
      return [];
    }
    const actionName = 'search';
    const response = await this.resourceAction({
      resourceId,
      actionName,
      query,
      ...(searchProperty ? { params: { searchProperty } } : undefined),
    });
    checkResponse(response);
    return response.data.records;
  }

  /**
   * Invokes given resource {@link Action} on the backend.
   *
   * @param   {ResourceActionAPIParams}     options
   * @return  {Promise<ActionResponse>}     response from an {@link Action}
   */
  async resourceAction(
    options: ResourceActionAPIParams
  ): Promise<AxiosResponse<ActionResponse>> {
    const { resourceId, actionName, data, query, search, ...axiosParams } =
      options;
    let url = `/api/resources/${resourceId}/actions/${actionName}${
      search ?? ''
    }`;
    if (query) {
      const q = encodeURIComponent(query);
      url = [url, q].join('/');
    }
    const response = await this.client.request({
      url,
      method: data ? 'POST' : 'GET',
      ...axiosParams,
      data,
    });
    checkResponse(response);
    return response;
  }

  /**
   * Invokes given record {@link Action} on the backend.
   *
   * @param   {RecordActionAPIParams} options
   * @return  {Promise<RecordActionResponse>}            response from an {@link Action}
   */
  async recordAction(
    options: RecordActionAPIParams
  ): Promise<AxiosResponse<RecordActionResponse>> {
    const { resourceId, recordId, actionName, data, ...axiosParams } = options;
    console.log('presend', data);
    const response = await this.client.request({
      url: `/api/resources/${resourceId}/records/${recordId}/${actionName}`,
      method: data || actionName === 'delete' ? 'POST' : 'GET',
      ...axiosParams,
      data,
    });
    checkResponse(response);
    return response;
  }

  /**
   * Invokes given bulk {@link Action} on the backend.
   *
   * @param   {BulkActionAPIParams} options
   * @return  {Promise<BulkActionResponse>}            response from an {@link Action}
   */
  async bulkAction(
    options: BulkActionAPIParams
  ): Promise<AxiosResponse<BulkActionResponse>> {
    const { resourceId, recordIds, actionName, data, ...axiosParams } = options;

    const params = new URLSearchParams();
    params.set('recordIds', (recordIds || []).join(','));

    const response = await this.client.request({
      url: `/api/resources/${resourceId}/bulk/${actionName}`,
      method: data ? 'POST' : 'GET',
      ...axiosParams,
      data,
      params,
    });
    checkResponse(response);
    return response;
  }

  async refreshToken(data: Record<string, any>) {
    const response = await this.client.request({
      url: '/refresh-token',
      method: 'POST',
      data,
    });
    checkResponse(response);

    return response;
  }
}

export { ApiClient as default, ApiClient };
