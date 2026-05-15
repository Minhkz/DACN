import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

export const clientApi = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: () => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

clientApi.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<any>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    const status = error.response?.status;
    const url = originalRequest?.url || "";

    const isRefreshRequest = url.includes("/auth/refresh");
    const shouldSkipRefresh = originalRequest?.skipAuthRefresh === true;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !shouldSkipRefresh
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => clientApi(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await axios.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true,
          },
        );

        processQueue();

        return clientApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
