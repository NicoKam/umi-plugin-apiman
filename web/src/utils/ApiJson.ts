// ApiJson

export type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type BasicType = 'string' | 'number' | 'boolean';
export type ObjectType = 'object';
export type ParamVariableType = BasicType | ObjectType;

export interface BaseParamSchema {
  type: BasicType;
  array?: boolean;
  description?: string;
  required?: boolean;
}

export interface ObjectParamSchema {
  type: ObjectType;
  array?: boolean;
  description?: string;
  required?: boolean;
  properties: Record<string, ParamSchema>;
}

export type ParamSchema = BaseParamSchema | ObjectParamSchema;

export type ResponseType = 'json' | 'formData' | 'text' | 'blob' | 'arrayBuffer';

export type ApiProps = {

  /** 自定义接口名 */
  serviceName: string;

  /** 接口描述 */
  description: string;

  /** 额外的 headers */
  headers?: Record<string, string>;

  /** 参数格式 */
  params?: Record<string, ParamSchema>;

  /** 响应类型 */
  requestType?: 'json' | 'formData';

  /** 响应类型 */
  responseType?: ResponseType;

  /** 响应格式 */
  response?: ParamSchema;

  /** 异常处理方式 */
  errorHandler?: 'throw' | 'ignore';
  [key: string]: unknown;
};

export interface ApiJson {

  /** 继承其他文件 */
  extends: string | string[];

  /** 接口描述 */
  api: Record<string, ApiProps>;

  /** 配置 */
  config: Record<string, unknown>;
}

export type ApiItem = ApiProps & {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  apiPath: string;
};

export function apiToArr(api: Record<string, ApiProps>): ApiItem[] {
  return Object.entries(api).map(([key, api]) => {
    const [method, apiPath] = key.split('|');
    return {
      ...api,
      method: method as MethodType,
      apiPath,
    };
  });
}
