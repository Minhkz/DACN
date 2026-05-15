import axios from "axios";

export type ApiErrorResponse = {
  datetime?: string;
  errorCode?: string | number;
  message?: string;
  details?: string;
  field?: string | null;
  errors?: Record<string, string> | string[] | null;
};

export function getAxiosErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.details ||
      error.message ||
      "Có lỗi xảy ra"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Có lỗi xảy ra";
}

export function getAxiosErrorStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }

  return undefined;
}

export function getAxiosErrorData(
  error: unknown,
): ApiErrorResponse | undefined {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data;
  }

  return undefined;
}
