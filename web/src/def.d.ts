export type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ResponseWrapper<T> = {
  errCode: number;
  errMsg: string;
  data: T;
};
