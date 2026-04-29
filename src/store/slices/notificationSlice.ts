import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState, NotificationItem } from '../../types';

const SEED: NotificationItem[] = [
  { id: 'n1', title: 'Critical Alert', message: "Deepa Krishnan's SpO2 dropped to 92%", type: 'alert', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), read: false },
  { id: 'n2', title: 'Appointment Reminder', message: 'Dr. Sharma has 3 appointments in the next hour', type: 'info', timestamp: new Date(Date.now() - 20 * 60000).toISOString(), read: false },
  { id: 'n3', title: 'Lab Results Ready', message: "Arjun Mehta's blood panel results are available", type: 'success', timestamp: new Date(Date.now() - 60 * 60000).toISOString(), read: true },
  { id: 'n4', title: 'Medication Due', message: 'Evening medication round starts in 15 minutes', type: 'warning', timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(), read: true },
];

const initialState: NotificationState = {
  notifications: SEED,
  permissionGranted: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<NotificationItem>) {
      state.notifications.unshift(action.payload);
    },
    markRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state) {
      state.notifications.forEach(n => { n.read = true; });
    },
    setPermissionGranted(state, action: PayloadAction<boolean>) {
      state.permissionGranted = action.payload;
    },
  },
});

export const { addNotification, markRead, markAllRead, setPermissionGranted } = notificationSlice.actions;
export default notificationSlice.reducer;
