import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import patientReducer from "../features/patients/patientSlice";
import notificationReducer from "./slices/notificationSlice";
import doctorReducer from "../features/doctors/doctorSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    doctors: doctorReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
