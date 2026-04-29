export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendLocalNotification(title: string, body: string, url = '/') {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      payload: { title, body, url },
    });
  } else if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icon-192.png' });
  }
}

export function scheduleVitalAlert(patientName: string, vital: string) {
  setTimeout(() => {
    sendLocalNotification(
      '⚠️ Vital Alert',
      `${patientName}'s ${vital} requires immediate attention.`,
      '/patients'
    );
  }, 3000);
}
