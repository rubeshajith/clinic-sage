import { Phone, Droplets, User } from "lucide-react";
import { Patient } from "../../../types";
import styles from "./PatientCard.module.css";

interface Props {
  patient: Patient;
}

export default function PatientCard({ patient: p }: Props) {
  const statusClass = p.status.toLowerCase() as
    | "active"
    | "critical"
    | "recovered"
    | "discharged";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <User size={18} strokeWidth={1.4} />
        </div>
        <div className={styles.identity}>
          <strong>{p.name}</strong>
          <span>
            {p.id} · {p.age}y · {p.gender}
          </span>
        </div>
        <span className={`badge badge--${statusClass}`}>{p.status}</span>
      </div>

      <div className={styles.condition}>
        <span className={styles.condLabel}>Condition</span>
        <span>{p.condition}</span>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Ward</span>
          <span>{p.ward}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Doctor</span>
          <span>{p.doctor.replace("Dr. ", "")}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Admitted</span>
          <span>
            {new Date(p.admittedDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </div>

      <div className={styles.vitals}>
        {[
          ["BP", p.vitals.bp],
          ["Pulse", `${p.vitals.pulse} bpm`],
          ["Temp", `${p.vitals.temp}°C`],
          ["SpO₂", `${p.vitals.spo2}%`],
        ].map(([k, v]) => (
          <div
            key={k}
            className={`${styles.vital} ${k === "SpO₂" && p.vitals.spo2 < 95 ? styles.vitalAlert : ""}`}
          >
            <span className={styles.vitalKey}>{k}</span>
            <span className={styles.vitalVal}>{v}</span>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.bloodGroup}>
          <Droplets size={12} />
          {p.bloodGroup}
        </div>
        <div className={styles.phone}>
          <Phone size={12} />
          {p.phone}
        </div>
      </div>
    </div>
  );
}
