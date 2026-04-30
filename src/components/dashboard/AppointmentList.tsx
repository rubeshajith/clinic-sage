import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowDownUp } from "lucide-react";
import { Appointment } from "../../types/appointments";
import { MOCK_APPOINTMENTS } from "../../utils/appointmentData";
import styles from "./AppointmentList.module.css";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const VISIBLE_DAYS = 7;

function getWeekDates(anchorDate: Date): Date[] {
  // Start from Saturday of the week containing anchorDate
  const day = anchorDate.getDay(); // 0=Sun
  const saturday = new Date(anchorDate);
  saturday.setDate(anchorDate.getDate() - ((day + 1) % 7));
  return Array.from({ length: VISIBLE_DAYS }, (_, i) => {
    const d = new Date(saturday);
    d.setDate(saturday.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${day} ${month} ${year} / ${hh}:${mm}:${ss}`;
}

function hasAppointments(date: Date, appointments: Appointment[]) {
  return appointments.some((a) => isSameDay(new Date(a.dateTime), date));
}

interface Props {
  appointments?: Appointment[];
}

export default function AppointmentList({
  appointments = MOCK_APPOINTMENTS,
}: Props) {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDates = useMemo(() => {
    const anchor = new Date(today);
    anchor.setDate(today.getDate() + weekOffset * 7);
    return getWeekDates(anchor);
  }, [today, weekOffset]);

  const filtered = useMemo(() => {
    return appointments.filter((a) =>
      isSameDay(new Date(a.dateTime), selectedDate),
    );
  }, [appointments, selectedDate]);

  // Show all if no filtered (for demo with mismatched dates)
  const displayed = filtered.length > 0 ? filtered : appointments;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>Patient's Appointment</h3>
        <button className={styles.moreBtn} aria-label="More options">
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Calendar strip */}
      <div className={styles.calendarStrip}>
        <button
          className={styles.navBtn}
          onClick={() => setWeekOffset((w) => w - 1)}
          aria-label="Previous week"
        >
          <ChevronLeft size={15} strokeWidth={1.8} />
        </button>

        <div className={styles.days}>
          {weekDates.map((date, i) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            const hasDot = hasAppointments(date, appointments);
            const isPast = date < today && !isToday;

            return (
              <button
                key={i}
                className={`${styles.dayBtn} ${isSelected ? styles.daySelected : ""} ${isPast ? styles.dayPast : ""}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className={styles.dayName}>{DAYS[date.getDay()]}</span>
                <span className={styles.dayNum}>{date.getDate()}</span>
                {hasDot && !isSelected && <span className={styles.dot} />}
              </button>
            );
          })}
        </div>

        <button
          className={styles.navBtn}
          onClick={() => setWeekOffset((w) => w + 1)}
          aria-label="Next week"
        >
          <ChevronRight size={15} strokeWidth={1.8} />
        </button>
      </div>

      {/* Table */}
      <div className={styles.table}>
        <div className={styles.tableHead}>
          <div className={styles.thPatient}>
            List of appointment
            <ArrowDownUp size={12} strokeWidth={1.8} />
          </div>
          <div className={styles.thCell}>Date and Time</div>
          <div className={styles.thCell}>Age</div>
          <div className={styles.thCell}>Date of birth</div>
          <div className={styles.thCell}>Insurance</div>
        </div>

        <div className={styles.tableBody}>
          {displayed.map((appt) => (
            <div key={appt.id} className={styles.tableRow}>
              <div className={styles.patientCell}>
                <div className={styles.avatar}>{appt.avatar}</div>
                <div className={styles.patientInfo}>
                  <span className={styles.patientName}>{appt.patientName}</span>
                  <span className={styles.patientId}>{appt.patientId}</span>
                </div>
              </div>
              <div className={styles.cell}>{formatDateTime(appt.dateTime)}</div>
              <div className={styles.cell}>{appt.age} Years old</div>
              <div className={styles.cell}>{appt.dob}</div>
              <div className={styles.cell}>{appt.insurance}</div>
            </div>
          ))}
        </div>

        {displayed.length === 0 && (
          <div className={styles.empty}>No appointments for this date.</div>
        )}
      </div>
    </div>
  );
}
