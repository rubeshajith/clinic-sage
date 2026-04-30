import { Patient } from "../../../types";
import EntityCard from "../../../components/entityCard/EntityCard";

interface Props {
  patient: Patient;
}

export default function PatientCard({ patient: p }: Props) {
  return (
    <EntityCard
      id={p.id}
      name={p.name}
      age={p.age}
      gender={p.gender}
      status={p.status}
      subtitle="Condition"
      subtitleValue={p.condition}
      metaFields={[
        { label: "Ward", value: p.ward },
        { label: "Doctor", value: p.doctor.replace("Dr. ", "") },
        {
          label: "Admitted",
          value: new Date(p.admittedDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
        },
      ]}
      vitals={[
        { key: "BP", value: p.vitals.bp },
        { key: "Pulse", value: `${p.vitals.pulse} bpm` },
        { key: "Temp", value: `${p.vitals.temp}°C` },
        { key: "SpO₂", value: `${p.vitals.spo2}%`, alert: p.vitals.spo2 < 95 },
      ]}
      footerLeft={{ icon: "droplet", value: p.bloodGroup }}
      footerRight={{ icon: "phone", value: p.phone }}
    />
  );
}
