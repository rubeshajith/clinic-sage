import { Bell, BellOff, Check, CheckCheck, AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { markRead, markAllRead, addNotification } from '../store/slices/notificationSlice';
import { requestNotificationPermission, sendLocalNotification } from '../utils/notifications';
import { setPermissionGranted } from '../store/slices/notificationSlice';
import { NotificationItem } from '../types';
import styles from './NotificationsPage.module.css';

const TypeIcon = ({ type }: { type: NotificationItem['type'] }) => {
  const props = { size: 16, strokeWidth: 1.6 };
  if (type === 'alert')   return <AlertCircle {...props} />;
  if (type === 'warning') return <AlertTriangle {...props} />;
  if (type === 'success') return <CheckCircle {...props} />;
  return <Info {...props} />;
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { notifications, permissionGranted } = useAppSelector(s => s.notifications);
  const unread = notifications.filter(n => !n.read).length;

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    dispatch(setPermissionGranted(granted));
    if (granted) {
      sendLocalNotification('Notifications Enabled', 'You will now receive real-time clinical alerts.');
      dispatch(addNotification({
        id: `n-${Date.now()}`,
        title: 'Notifications Enabled',
        message: 'You will now receive real-time clinical alerts.',
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false,
      }));
    }
  };

  const simulateAlert = () => {
    const alerts = [
      { title: '⚠️ Vital Alert', message: "Patient Rajan Bose's temperature spiked to 39.1°C" },
      { title: '💊 Medication Due', message: 'Ward B evening medication round starting now' },
      { title: '📋 Lab Report', message: "Sunita Rao's HbA1c results are ready for review" },
    ];
    const a = alerts[Math.floor(Math.random() * alerts.length)];
    dispatch(addNotification({
      id: `n-${Date.now()}`,
      title: a.title,
      message: a.message,
      type: 'warning',
      timestamp: new Date().toISOString(),
      read: false,
    }));
    if (permissionGranted) sendLocalNotification(a.title, a.message);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Alerts & Notifications</h1>
          <p className={styles.sub}>{unread} unread · {notifications.length} total</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={simulateAlert}>
            <Bell size={14} strokeWidth={1.6} />
            Simulate Alert
          </button>
          {!permissionGranted ? (
            <button className={styles.btnPrimary} onClick={handleRequestPermission}>
              <Bell size={14} strokeWidth={1.6} />
              Enable Push Notifications
            </button>
          ) : (
            <div className={styles.enabled}>
              <CheckCircle size={14} />
              Push enabled
            </div>
          )}
          {unread > 0 && (
            <button className={styles.btn} onClick={() => dispatch(markAllRead())}>
              <CheckCheck size={14} strokeWidth={1.6} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {!permissionGranted && (
        <div className={styles.permissionBanner}>
          <BellOff size={16} />
          <div>
            <strong>Push notifications are disabled.</strong>
            <span>Enable them to receive real-time critical patient alerts even when the tab is in background.</span>
          </div>
          <button onClick={handleRequestPermission}>Enable</button>
        </div>
      )}

      <div className={styles.list}>
        {notifications.length === 0 && (
          <div className={styles.empty}>
            <Bell size={32} strokeWidth={1} />
            <p>No notifications yet</p>
          </div>
        )}
        {notifications.map(n => (
          <div
            key={n.id}
            className={`${styles.item} ${!n.read ? styles.unread : ''} ${styles[`type-${n.type}`]}`}
            onClick={() => dispatch(markRead(n.id))}
          >
            <div className={`${styles.iconWrap} ${styles[`icon-${n.type}`]}`}>
              <TypeIcon type={n.type} />
            </div>
            <div className={styles.content}>
              <strong>{n.title}</strong>
              <p>{n.message}</p>
            </div>
            <div className={styles.meta}>
              <span className={styles.time}>{timeAgo(n.timestamp)}</span>
              {!n.read && (
                <button className={styles.readBtn} onClick={e => { e.stopPropagation(); dispatch(markRead(n.id)); }} title="Mark as read">
                  <Check size={12} />
                </button>
              )}
            </div>
            {!n.read && <div className={styles.dot} />}
          </div>
        ))}
      </div>
    </div>
  );
}
