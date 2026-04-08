export type AuthResponse = {
  datetime: string;
  errorCode: string;
  message: string;
  success: boolean;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
  };
};

export type ApiErrorResponse = {
  message: string;
  success: false;
  errorCode?: string;
};
