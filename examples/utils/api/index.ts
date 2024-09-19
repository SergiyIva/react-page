import { ActionJSON } from './interface';
import { AxiosResponse } from 'axios';
import ApiClient from './api-client';
import { ActionResponse } from './action.interface';
import {
  ActionParams,
  BulkActionParams,
  RecordActionParams,
} from './view-helpers';

export type DifferentActionParams = {
  resourceId: ActionParams['resourceId'];
  recordId?: RecordActionParams['recordId'];
  recordIds?: BulkActionParams['recordIds'];
  search?: string;
};

const API_DOMAIN = 'http://localhost:3333/admin';
const API_KEY = 'test';
const api = new ApiClient(API_DOMAIN, API_KEY);

function callActionApi<K extends ActionResponse>(
  action: ActionJSON,
  params: DifferentActionParams,
  search?: Location['search']
): Promise<AxiosResponse<K>> {
  let promise: Promise<AxiosResponse<K>>;
  const { recordId, recordIds, resourceId } = params;

  let method = 'get';
  if (action.name === 'delete') {
    method = 'post';
  }

  switch (action.actionType) {
    case 'record':
      if (!recordId) {
        throw new Error('You have to specify "recordId" for record action');
      }
      promise = api.recordAction({
        resourceId,
        actionName: action.name,
        recordId,
        search,
        method,
      }) as any;
      break;
    case 'resource':
      promise = api.resourceAction({
        resourceId,
        actionName: action.name,
        method,
        search,
      }) as any;
      break;
    case 'bulk':
      if (!recordIds) {
        throw new Error('You have to specify "recordIds" for bulk action');
      }
      promise = api.bulkAction({
        resourceId,
        actionName: action.name,
        recordIds,
        search,
        method,
      }) as any;
      break;
    default:
      throw new Error('"actionType" should be either record, resource or bulk');
  }
  return promise;
}

export default callActionApi;
