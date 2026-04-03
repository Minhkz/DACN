import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Icon cảnh báo */}
        <div className="flex justify-center">
          <svg
            className="h-24 w-24 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Nội dung lỗi */}
        <div>
          <h1 className="text-7xl font-extrabold tracking-tight text-gray-900">
            401
          </h1>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            Không có quyền truy cập!
          </h2>
          <p className="mt-4 text-base text-gray-600">
            Trang bạn đang cố gắng truy cập yêu cầu phải đăng nhập hoặc bạn
            không có đủ phân quyền (Role) để xem nội dung này.
          </p>
        </div>

        {/* Nút điều hướng */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signin"
            className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
