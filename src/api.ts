import fetch from '/root/project/umi-plugin/umi-plugin-apiman/src/fetch/fetch';

export interface JsonResponseWrapper<T> {
  success: boolean;
  errCode: string | number;
  errMsg: string | number;
  data: T;
}

/* getUserList start */

/**
 * 获取用户列表 - 参数结构
 */
export type GetUserListParam = {
  /**
   * 用户名
   * 支持中文/英文字母/数字
   */
  userName?: string;
  /** 用户id */
  userId: string;
  /** 用户id列表 */
  userList?: {
    /** 用户id */
    id?: string;
    /**
     * 用户名
     * 支持中文/英文字母/数字
     */
    userName?: string;
  }[];
};

/**
 * 获取用户列表 - 响应结构
 */
export type GetUserListResponseData = {
  /** 数据总量 */
  total?: number;
  /** 用户列表 */
  list?: {
    /** 用户ID */
    userId?: string;
    /** 用户名 */
    userName?: string;
    /** 年龄 */
    age?: number;
  }[];
};

/**
 * 获取用户列表
 */
export const getUserList = (params: GetUserListParam) =>
  fetch<JsonResponseWrapper<GetUserListResponseData>>('/user', params, {
    headers: {},
  });

/* getUserList end */

/* getUserById start */

/**
 * 获取用户详情 - 参数结构
 */
export type GetUserByIdParam = {
  userId: string;
};

/**
 * 获取用户详情 - 响应结构
 */
export type GetUserByIdResponseData = {
  /** 用户ID */
  userId?: string;
  /** 用户名 */
  userName?: string;
  /** 年龄 */
  age?: number;
};

/**
 * 获取用户详情
 */
export const getUserById = (params: GetUserByIdParam) =>
  fetch<JsonResponseWrapper<GetUserByIdResponseData>>('/user/{userId}', params, {
    headers: {},
  });

/* getUserById end */
