export interface RoleResponse<T> {
  datetime: string;
  errorCode: string;
  message: string;
  data: T;
  success: boolean;
}
