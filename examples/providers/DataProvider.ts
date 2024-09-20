import { stringify } from 'qs';
import { DataProvider } from 'react-admin';
import ApiClient from '../utils/api/api-client';
import pako from 'pako';

const API_DOMAIN = 'http://localhost:3333/admin';
const API_KEY = 'test';
const api = new ApiClient(API_DOMAIN, API_KEY);

const dataProvider: DataProvider = {
  getList: async (resource: any, params: any) => {
    const { field, order } = params.sort;
    const search = stringify(
      { ...params.pagination, sortBy: field, direction: order.toLowerCase() },
      { addQueryPrefix: true }
    );

    const { data } = await api.resourceAction({
      resourceId: resource,
      actionName: 'list',
      method: 'GET',
      search,
    });
    return {
      data: data.records,
      total: data.meta.total,
    };
  },

  getOne: async (resource: any, params: any) => {
    const { data } = await api.recordAction({
      resourceId: resource,
      recordId: params.id,
      actionName: 'show',
    });
    const uint = new Uint8Array(
      data.record.params.content.split(',').map(Number)
    );
    const str = new TextDecoder().decode(pako.ungzip(uint));
    return {
      data: {
        ...data.record.params,
        ...(data.record.params.content
          ? {
              content: JSON.parse(str),
              // content: JSON.parse(data.record.params.content),
            }
          : {}),
      } as any,
    };
  },
  getMany: async (resource: any, params: any) => {
    const { field, order } = params.sort;
    const search = stringify(
      { ...params.pagination, sortBy: field, direction: order.toLowerCase() },
      { addQueryPrefix: true }
    );

    const { data } = await api.resourceAction({
      resourceId: resource,
      actionName: 'list',
      method: 'GET',
      search,
    });
    return {
      data: data.records,
      total: data.meta.total,
    };
  },
  getManyReference: async (resource, params) => {
    const { field, order } = params.sort;
    const search = stringify(
      { ...params.pagination, sortBy: field, direction: order.toLowerCase() },
      { addQueryPrefix: true }
    );

    const { data } = await api.resourceAction({
      resourceId: resource,
      actionName: 'list',
      method: 'GET',
      search,
    });
    return {
      data: data.records,
      total: data.meta.total,
    };
  },

  create: async (resource, params) => {
    const { data } = await api.resourceAction({
      resourceId: resource,
      actionName: 'new',
      method: 'POST',
      data: {
        ...params.data,
        ...(params.data.content
          ? {
              content: pako
                .gzip(JSON.stringify(params.data.content))
                .toString(),
            }
          : {}),
        headers: {
          'content-encoding': 'gzip',
        },
      },
    });
    return {
      data: data.record.params,
    };
  },

  update: async (resource, params) => {
    console.log(
      new TextDecoder().decode(pako.gzip(JSON.stringify(params.data.content)))
    );
    const { data } = await api.recordAction({
      resourceId: resource,
      recordId: params.id.toString(),
      actionName: 'edit',
      data: params.data.content
        ? {
            ...params.data,
            content: pako.gzip(JSON.stringify(params.data.content)).toString(),
          }
        : params.data,
      headers: {
        'content-encoding': 'gzip',
      },
    });
    return { data: data.record.params as any };
  },

  updateMany: async (resource, params) => {
    return { data: [] };
  },

  delete: async (resource, params) => {
    const { data } = await api.recordAction({
      resourceId: resource,
      recordId: params.id.toString(),
      actionName: 'delete',
    });

    return { data: data.record.params as any };
  },

  deleteMany: async (resource, params) => {
    const { data } = await api.bulkAction({
      resourceId: resource,
      recordIds: params.ids.map(String),
      actionName: 'bulkDelete',
      data: {},
    });
    return { data: data.records.map((r) => r.id) };
  },
};

export default dataProvider;
