import { Patient } from "../../../types";
import EntityRow from "../../../components/entityRow/EntityRow";

interface Props {
  patient: Patient;
}

export default function PatientRow({ patient: p }: Props) {
  return (
    <EntityRow
      id={p.id}
      name={p.name}
      status={p.status}
      gridCols={8}
      columns={[
        { value: `${p.age}y / ${p.gender}`, stacked: true },
        { value: p.condition },
        { value: p.ward, secondary: true },
        { value: p.doctor, secondary: true },
        {
          value: `BP ${p.vitals.bp} / SpO₂ ${p.vitals.spo2}%`,
          stacked: true,
          alert: p.vitals.spo2 < 95,
        },
      ]}
      iconCol={{ icon: "droplet", value: p.bloodGroup }}
    />
  );
}
