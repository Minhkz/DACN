import axios from 'axios';

export const clientApi = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Hàm xử lý các request đang xếp hàng
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

clientApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và CHƯA TỪNG được thử lại (_retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Đánh dấu là đã thử refresh rồi, nếu lần sau vẫn 401 thì dẹp luôn, không loop nữa
      originalRequest._retry = true;

      // Nếu hệ thống đang trong quá trình refresh token (do 1 request khác đã gọi trước đó)
      if (isRefreshing) {
        // Đưa request này vào hàng đợi, chờ lệnh giải phóng
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return clientApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Nếu đây là request 401 ĐẦU TIÊN
      isRefreshing = true;

      try {
        // 1. Dùng axios THƯỜNG để gọi refresh (TUYỆT ĐỐI không dùng clientApi ở đây để tránh loop)
        await axios.post('/api/auth/refresh');

        // 2. Refresh thành công -> Xử lý hàng đợi
        processQueue(null);

        // 3. Gọi lại request ban đầu
        return clientApi(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại (Refresh token cũng hết hạn nốt)
        processQueue(refreshError, null);

        // Đá về trang đăng nhập
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      } finally {
        // Dọn dẹp trạng thái
        isRefreshing = false;
      }
    }

    // Các lỗi khác ngoài 401 thì ném ra bình thường
    return Promise.reject(error);
  }
);
