import notifications from '../mocks/notifications.json';

export const getNotifications = () => {
  return new Promise((resolve) => {
      setTimeout(() => {
        resolve(notifications);
      }, 1000)
  })
}
