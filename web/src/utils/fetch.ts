/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { extend } from 'umi-request';
import type { ResponseWrapper } from '../def.d';

/* 异常处理 */
const errorHandler = function(error: ResponseError) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(error.response.status, error.request);
  } else {
    // The request was made but no response was received or error occurs when setting up the request.
    console.error('Request error:', error.message);
  }
  throw error;
};

const request = extend({
  // 为每个请求添加前缀
  prefix: '/api',
  errorHandler,
});

/* 处理data */
const handleResponseData = <T>(data: T) => data;

const get = <T = any>(
  url: string,
  params?: Record<string, number | string | boolean> | URLSearchParams,
  options?: RequestOptionsInit,
) =>
    request
      .get<ResponseWrapper<T>>(url, { ...options, params })
      .then(handleResponseData);

const post = <T = any>(url: string, data?: Record<string, any>, options?: RequestOptionsInit) =>
  request
    .post<ResponseWrapper<T>>(url, { ...options, data })
    .then(handleResponseData);

const put = <T = any>(url: string, data?: Record<string, any>, options?: RequestOptionsInit) =>
  request
    .put<ResponseWrapper<T>>(url, { ...options, data })
    .then(handleResponseData);

const del = <T = any>(url: string, data?: Record<string, any>, options?: RequestOptionsInit) =>
  request
    .delete<ResponseWrapper<T>>(url, { ...options, data })
    .then(handleResponseData);

/**
 * // How to upload file?
 * const formData = new FormData();
 * formData.append('file', file);
 * fetch('/api/v1/some/api', { method: 'POST', body: formData });
 */

// 导出你所需要使用的方法
export { request, get, post, put, del };
