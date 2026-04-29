import { Droplet } from "lucide-react";
import { Patient } from "../../../types";
import styles from "./PatientRow.module.css";

interface Props {
  patient: Patient;
}

export default function PatientRow({ patient: p }: Props) {
  const statusClass = p.status.toLowerCase() as string;
  return (
    <div className={styles.row}>
      <div className={styles.identity}>
        <div className={styles.avatar}>{p.name[0]}</div>
        <div>
          <strong>{p.name}</strong>
          <span>{p.id}</span>
        </div>
      </div>
      <span>
        {p.age}y <br /> {p.gender}
      </span>
      <div>{p.condition}</div>
      <div className={styles.ward}>{p.ward}</div>
      <div className={styles.doctor}>{p.doctor}</div>
      <div className={styles.vitals}>
        <span>BP {p.vitals.bp}</span>
        <span className={p.vitals.spo2 < 95 ? styles.alertVal : ""}>
          SpO₂ {p.vitals.spo2}%
        </span>
      </div>
      <div className={styles.blood}>
        <Droplet size={12} />
        {p.bloodGroup}
      </div>
      <span
        className={`badge badge--${statusClass}`}
        style={{ width: "fit-content" }}
      >
        {p.status}
      </span>
    </div>
  );
}
