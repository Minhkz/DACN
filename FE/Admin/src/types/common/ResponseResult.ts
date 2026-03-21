export type ResponseResult<T> = {
  datetime: string;
  errorCode: string;
  message: string;
  data: T;
};
