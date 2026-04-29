export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  avatar: string;
  dateTime: string;
  age: number;
  dob: string;
  insurance: string;
}

export interface DoctorSchedule {
  id: string;
  name: string;
  specialty: string;
  status: 'Available' | 'Unavailable' | 'Leave';
  avatar: string;
}

export interface DoctorStats {
  available: number;
  unavailable: number;
  leave: number;
}
