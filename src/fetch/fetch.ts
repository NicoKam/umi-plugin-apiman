/* eslint-disable no-lonely-if */
import fetch from 'isomorphic-fetch';
import qs from 'qs';
import Interceptor from './Interceptor';

function toFormData(obj: Record<string, unknown>) {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value != null) {
      formData.append(key, value instanceof Blob ? value : String(value));
    }
  });
  return formData;
}

export type RequestType = 'json' | 'formData';
export type ResponseType = 'json' | 'arrayBuffer' | 'text' | 'blob' | 'formData';

/** fetch 额外的配置 */
export type ApiManOptions = {

  /** 请求类型 */
  requestType?: RequestType;

  /** 响应类型类型 */
  responseType?: ResponseType;

  /** 异常处理方式（抛出异常|忽略异常） */
  errorHandler?: 'throw' | 'ignore';
};

/** 请求拦截器参数 */
export type RequestInterceptorParam = {
  url: string;
  params: Record<string, unknown>;
  options: RequestInit;
};

/** 请求拦截器定义 */
export type RequestInterceptor = (
  p: RequestInterceptorParam,
) => RequestInterceptorParam | Promise<RequestInterceptorParam> | undefined;

/** 响应拦截器参数 */
export type ResponseInterceptorParam<T> = RequestInterceptorParam & {
  result: T;
};

/** 响应拦截器定义 */
export type ResponseInterceptor<T = unknown> = (p: ResponseInterceptorParam<T>) => T | Promise<T> | undefined;

/** 拦截器 */
export const interceptor = {
  request: new Interceptor<RequestInterceptor>(),
  json: new Interceptor<ResponseInterceptor<Record<string, unknown>>>(),
  text: new Interceptor<ResponseInterceptor<string>>(),
  arrayBuffer: new Interceptor<ResponseInterceptor<ArrayBuffer>>(),
  blob: new Interceptor<ResponseInterceptor<Blob>>(),
  formData: new Interceptor<ResponseInterceptor<FormData>>(),
};

function execResponseInterceptor<U, T extends Interceptor<ResponseInterceptor<U>>>(interceptor: T) {
  return async function (params: ResponseInterceptorParam<U>) {
    let respPromise = Promise.resolve(params.result);
    interceptor.toArray().forEach((interceptFunction) => {
      respPromise = respPromise.then(async (result) => {
        const newResult = await interceptFunction({
          ...params,
          result,
        });

        /* 响应拦截器的返回值在不为undefined的情况下视为有效，否则跳至下一个拦截器 */
        if (newResult !== undefined) {
          return newResult;
        }
        return result;
      });
    });
    return respPromise;
  };
}

type RequestOptions = RequestInit & ApiManOptions;

/** 响应异常封装 */
export class ResponseError extends Error {
  status?: number;

  errCode?: number;

  errorText?: string;

  requestInfo?: {
    url: string;
    params: Record<string, unknown>;
    options: RequestOptions;
  };
}

/**
 * 对 fetch 的简单封装
 * @param apiPath API路径
 * @param params 请求参数
 * @param options 其它配置
 */
const wrappedFetch = async <ResponseType extends unknown>(
  url: string,
  params: Record<string, unknown> = {},
  options: Omit<RequestInit & ApiManOptions, 'body'> = {},
): Promise<ResponseType> => {
  const method = (options?.method || 'GET').toUpperCase();
  const { requestType = 'json', responseType = 'json', errorHandler = 'throw', ...otherOptions } = options;

  if (requestType === 'json') {
    otherOptions.headers = {
      'x-requested-with': 'XMLHttpRequest',
      'content-type': 'application/json',
      ...otherOptions.headers,
    };
  }

  // 开始执行请求拦截器
  let promise: Promise<RequestInterceptorParam> = Promise.resolve({
    url,
    params,
    options: otherOptions,
  });
  interceptor.request.toArray().forEach((interceptFunction) => {
    promise = promise.then(async (requestInfo) => {
      const res = await interceptFunction(requestInfo);

      /* 只有前置拦截器的结果是对象，才视为有效结果，否则直接跳至下一个拦截器 */
      if (typeof res === 'object') {
        return {
          ...requestInfo,
          ...res,
        };
      }
      return requestInfo;
    });
  });

  const res = await promise;
  if (res !== undefined && typeof res !== 'object') {
    console.error('Final fetch url & options:', res);
    throw new Error('从前置拦截器获得的结果似乎不正确，请检查拦截器配置');
  }
  const { params: finalParams = params, options: finalOptions = otherOptions as RequestInit } = res;
  let { url: finalUrl = url } = res;
  // 完成请求拦截器

  if (method === 'GET') {
    // 拼装 get 请求的参数
    const queryString = qs.stringify(finalParams);
    if (queryString) {
      if (!finalUrl.endsWith('?')) {
        finalUrl += '?';
      }
      finalUrl += queryString;
    }
  } else {
    // 拼装 body
    if (requestType === 'formData') {
      // 拼装 formData 需要将 object 转换为 FormData
      const formData = finalParams instanceof FormData ? finalParams : toFormData(finalParams);
      finalOptions.body = formData;
    } else {
      // 添加 content-type
      finalOptions.body = JSON.stringify(finalParams);
    }
  }

  // 发出请求
  const response = await fetch(finalUrl, finalOptions);

  const finalRequestInfo = {
    url: finalUrl,
    params: finalParams,
    options: finalOptions,
  };

  // 处理异常
  if (response.status < 200 || response.status >= 300) {
    if (errorHandler === 'ignore') {
      // 忽略异常
      return {
        success: false,
        errorInfo: {
          status: response.status,
          errorText: response.statusText,
          requestInfo: finalRequestInfo,
        },
      };
    }
    // 抛出异常
    const error = new ResponseError(response.statusText);
    error.status = response.status;
    error.errCode = response.status;
    error.errorText = response.statusText;
    error.requestInfo = finalRequestInfo;
    throw error;
  }

  // 请求正确，根据 responseType 获得结果，并处理拦截器
  if (responseType === 'arrayBuffer') {
    return response.arrayBuffer().then(result =>
      execResponseInterceptor<ArrayBuffer, typeof interceptor.arrayBuffer>(interceptor.arrayBuffer)({
        ...finalRequestInfo,
        result,
      }),
    );
  }
  if (responseType === 'blob') {
    return response.blob().then(result =>
      execResponseInterceptor<Blob, typeof interceptor.blob>(interceptor.blob)({
        ...finalRequestInfo,
        result,
      }),
    );
  }
  if (responseType === 'formData') {
    return response.formData().then(result =>
      execResponseInterceptor<FormData, typeof interceptor.formData>(interceptor.formData)({
        ...finalRequestInfo,
        result,
      }),
    );
  }
  if (responseType === 'text') {
    return response.text().then(result =>
      execResponseInterceptor<string, typeof interceptor.text>(interceptor.text)({
        ...finalRequestInfo,
        result,
      }),
    );
  }
  return response.json().then(result =>
    execResponseInterceptor<Record<string, any>, typeof interceptor.json>(interceptor.json)({
      ...finalRequestInfo,
      result,
    }),
  );
};

export default wrappedFetch;
