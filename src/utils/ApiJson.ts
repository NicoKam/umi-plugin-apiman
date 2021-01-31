export interface BaseParamSchema {
  type: 'string' | 'number' | 'boolean';
  array?: boolean;
  description?: string;
  required?: boolean;
}

export interface ObjectParamSchema {
  type: 'object';
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

  /** 请求类型 */
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
  api: {
    [key: string]: ApiProps;
  };

  /** 配置 */
  config: Record<string, unknown>;
}
