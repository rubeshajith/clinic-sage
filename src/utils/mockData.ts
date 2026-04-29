import { AnalyticsData } from "../types";

export const ANALYTICS_DATA: AnalyticsData[] = [
  { month: "Sep", admissions: 42, discharges: 38, critical: 5 },
  { month: "Oct", admissions: 56, discharges: 51, critical: 8 },
  { month: "Nov", admissions: 48, discharges: 44, critical: 6 },
  { month: "Dec", admissions: 61, discharges: 55, critical: 10 },
  { month: "Jan", admissions: 53, discharges: 49, critical: 7 },
  { month: "Feb", admissions: 67, discharges: 60, critical: 9 },
  { month: "Mar", admissions: 72, discharges: 65, critical: 12 },
];

export const WARD_DISTRIBUTION = [
  { name: "Cardiology", value: 24 },
  { name: "ICU", value: 12 },
  { name: "Surgery", value: 18 },
  { name: "Pulmonology", value: 15 },
  { name: "Nephrology", value: 10 },
  { name: "Others", value: 21 },
];
export const DOCTOR_WORKLOAD = [
  { name: "Dr. Priya Sharma", patients: 32 },
  { name: "Dr. Rahul Mehta", patients: 27 },
  { name: "Dr. Ankit Verma", patients: 21 },
  { name: "Dr. Sneha Iyer", patients: 18 },
];

export const GENDER_SPLIT = [
  { name: "Male", value: 45 },
  { name: "Female", value: 40 },
  { name: "Other", value: 5 },
];

export const AGE_GROUPS = [
  { name: "0–20", value: 10 },
  { name: "21–40", value: 30 },
  { name: "41–60", value: 35 },
  { name: "60+", value: 15 },
];
