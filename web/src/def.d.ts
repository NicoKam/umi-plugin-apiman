export type ResponseWrapper<T> = {
  errCode: number;
  errMsg: string;
  data: T;
};
