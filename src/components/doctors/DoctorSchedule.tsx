import { ArrowDownUp } from 'lucide-react';
import { MOCK_DOCTORS, DOCTOR_SCHEDULE_STATS } from '../../utils/appointmentData';
import { DoctorSchedule as DoctorScheduleType, DoctorStats } from '../../types/appointments';
import styles from './DoctorSchedule.module.css';

const STATUS_LABEL: Record<DoctorScheduleType['status'], string> = {
  Available: 'Available',
  Unavailable: 'Unavailable',
  Leave: 'Leave',
};

interface Props {
  doctors?: DoctorScheduleType[];
  stats?: DoctorStats;
}

export default function DoctorSchedule({
  doctors = MOCK_DOCTORS,
  stats = DOCTOR_SCHEDULE_STATS,
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>Doctor's schedule</h3>
        <button className={styles.moreBtn} aria-label="More options">
          <span /><span /><span />
        </button>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Available</span>
          <span className={styles.statVal}>{stats.available}</span>
          <span className={styles.statSub}>Total</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Unavailable</span>
          <span className={styles.statVal}>{stats.unavailable}</span>
          <span className={styles.statSub}>Total</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Leave</span>
          <span className={styles.statVal}>{stats.leave}</span>
          <span className={styles.statSub}>Total</span>
        </div>
      </div>

      {/* List header */}
      <div className={styles.listHeader}>
        <span>List of Doctor</span>
        <ArrowDownUp size={12} strokeWidth={1.8} />
      </div>

      {/* Doctor list */}
      <div className={styles.list}>
        {doctors.map((doc) => (
          <div key={doc.id} className={styles.doctorRow}>
            <div className={styles.avatar}>{doc.avatar}</div>
            <div className={styles.info}>
              <span className={styles.name}>{doc.name}</span>
              <span className={styles.specialty}>· {doc.specialty}</span>
            </div>
            <span className={`${styles.statusBadge} ${styles[`status${doc.status}`]}`}>
              {STATUS_LABEL[doc.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
