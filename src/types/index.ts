export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  condition: string;
  status: "Active" | "Recovered" | "Critical" | "Discharged";
  doctor: string;
  admittedDate: string;
  ward: string;
  bloodGroup: string;
  phone: string;
  email: string;
  vitals: {
    bp: string;
    pulse: number;
    temp: number;
    spo2: number;
  };
  lastVisit: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface PatientState {
  patients: Patient[];
  viewMode: "grid" | "list";
  searchQuery: string;
  filterStatus: string;
  loading: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "alert" | "info" | "warning" | "success";
  timestamp: string;
  read: boolean;
}

export interface NotificationState {
  notifications: NotificationItem[];
  permissionGranted: boolean;
}

export interface AnalyticsData {
  month: string;
  admissions: number;
  discharges: number;
  critical: number;
}

export interface Doctor {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  specialty: string;
  status: "Active" | "On Leave" | "Inactive";
  department: string;
  phone: string;
  email: string;
  experience: number; // in years
  qualification: string;
  patientsAssigned: number;
  schedule: string;
  joinedDate: string;
  lastActive: string;
}

export interface DoctorState {
  doctors: Doctor[];
  viewMode: "grid" | "list";
  searchQuery: string;
  filterStatus: string;
  loading: boolean;
}
