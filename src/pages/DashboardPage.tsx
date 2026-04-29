import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { addNotification } from "../store/slices/notificationSlice";
import {
  requestNotificationPermission,
  scheduleVitalAlert,
} from "../utils/notifications";
import { setPermissionGranted } from "../store/slices/notificationSlice";
import AppointmentList from "../components/appointments/AppointmentList";
import DoctorSchedule from "../components/doctors/DoctorSchedule";
import styles from "./DashboardPage.module.css";
import WardOccupancy from "../components/dashboard/WardOccupancy";

const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  onClick,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  accent?: string;
  onClick?: () => void;
}) => (
  <div className={styles.statCard} onClick={onClick}>
    <div className={styles.statTop}>
      <span className={styles.statLabel}>{label}</span>
      <div
        className={styles.iconBox}
        style={{ background: accent ? `${accent}18` : undefined }}
      >
        <Icon size={16} style={{ color: accent }} strokeWidth={1.6} />
      </div>
    </div>
    <div className={styles.statVal}>{value}</div>
    <div className={styles.statSub}>{sub}</div>
  </div>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const patients = useAppSelector((s) => s.patients.patients);
  const user = useAppSelector((s) => s.auth.user);

  const active = patients.filter((p) => p.status === "Active").length;
  const critical = patients.filter((p) => p.status === "Critical").length;
  const recovered = patients.filter((p) => p.status === "Recovered").length;

  useEffect(() => {
    requestNotificationPermission().then((granted) => {
      dispatch(setPermissionGranted(granted));
      if (granted) {
        scheduleVitalAlert("Deepa Krishnan", "SpO2");
        setTimeout(() => {
          dispatch(
            addNotification({
              id: `n-${Date.now()}`,
              title: "Daily Summary",
              message: `${active} active patients, ${critical} critical today.`,
              type: "info",
              timestamp: new Date().toISOString(),
              read: false,
            }),
          );
        }, 1500);
      }
    });
  }, []);

  const criticalPatients = patients.filter((p) => p.status === "Critical");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Welcome back, {user?.displayName?.split("@")[0] ?? "Doctor"}</h1>
          <p className={styles.date}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className={styles.stats}>
        <StatCard
          label="Total Patients"
          value={patients.length}
          sub="Across all wards"
          icon={Users}
          accent="#4E8B6A"
          onClick={() => navigate("/patients?status=All")}
        />
        <StatCard
          label="Active"
          value={active}
          sub="Currently admitted"
          icon={Activity}
          accent="#2B52C1"
          onClick={() => navigate("/patients?status=Active")}
        />
        <StatCard
          label="Critical"
          value={critical}
          sub="Require attention"
          icon={AlertTriangle}
          accent="#C12B2B"
          onClick={() => navigate("/patients?status=Critical")}
        />
        <StatCard
          label="Recovered"
          value={recovered}
          sub="This month"
          icon={TrendingUp}
          accent="#7A8F85"
          onClick={() => navigate("/patients?status=Recovered")}
        />
      </div>

      {criticalPatients.length > 0 && (
        <section className={styles.midGrid}>
          {/* LEFT — Critical Patients */}
          <div>
            <div className={styles.sectionHead}>
              <h2>Critical Patients</h2>
              <button
                className={styles.viewAll}
                onClick={() => navigate("/patients?status=All")}
              >
                View all <ArrowRight size={14} />
              </button>
            </div>
            <div className={styles.criticalList}>
              {criticalPatients.map((p) => (
                <div
                  key={p.id}
                  className={styles.criticalCard}
                  onClick={() =>
                    navigate("/patients", {
                      state: { highlight: p.id },
                    })
                  }
                >
                  <div className={styles.critAvatar}>{p.name[0]}</div>
                  <div className={styles.critInfo}>
                    <strong>{p.name}</strong>
                    <span>
                      {p.condition} · {p.ward}
                    </span>
                  </div>
                  <div className={styles.vitals}>
                    <span>SpO₂ {p.vitals.spo2}%</span>
                    <span>BP {p.vitals.bp}</span>
                  </div>
                  <span className="badge badge--critical">Critical</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Ward Occupancy */}
          <WardOccupancy />
        </section>
      )}

      {/* ── Appointments + Doctor Schedule ── */}
      <section className={styles.bottomGrid}>
        <AppointmentList />
        <DoctorSchedule />
      </section>
    </div>
  );
}
