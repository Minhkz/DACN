import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const notify = (
  type: NotificationType,
  title: string,
  description?: string
) => {
  notification[type]({
    title,
    description,
    duration: 3,
    className: `app-notification app-notification-${type}`,
  });
};
