export const formatTimeAgo = (dateInput?: string | Date | null): string => {
  if (!dateInput) return '';

  const normalizedDate =
    typeof dateInput === 'string' ? dateInput.replace(' ', 'T') : dateInput;

  const date = new Date(normalizedDate);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return 'vừa xong';

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} ngày trước`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} tháng trước`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} năm trước`;
};
