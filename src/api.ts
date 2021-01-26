import fetch from '../fetch/fetch';

export interface JsonResponseWrapper<T> {
  success: boolean;
  errCode: string | number;
  errMsg: string | number;
  data: T;
}

/* getUserList start */

export type GetUserListParam = {};

export type GetUserListResponseType = {};

/**
* 获取用户列表
*/
export const getUserList = <GetUserListResponseType>(params: GetUserListParam) =>
  fetch<GetUserListResponseType>('/user', params, {
  "headers": {},
  "responseType": "json"
});

/* getUserList end */

/* getUserById start */

export type GetUserByIdParam = {};

export type GetUserByIdResponseType = {};

/**
* 获取用户详情
*/
export const getUserById = <GetUserByIdResponseType>(params: GetUserByIdParam) =>
  fetch<GetUserByIdResponseType>('/user/{userId}', params, {
  "headers": {}
});

/* getUserById end */
