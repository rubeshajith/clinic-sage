import EntityRow from "../../../components/entityRow/EntityRow";
import { Doctor } from "../../../types";

interface Props {
  doctor: Doctor;
}

export default function DoctorRow({ doctor: d }: Props) {
  return (
    <EntityRow
      id={d.id}
      name={d.name}
      status={d.status}
      gridCols={8}
      columns={[
        { value: `${d.age}y / ${d.gender}`, stacked: true },
        { value: d.specialty },
        { value: d.department, secondary: true },
        {
          value: `${d.experience} yrs exp / ${d.qualification}`,
          stacked: true,
        },
        {
          value: `${d.patientsAssigned} patients / ${d.schedule}`,
          stacked: true,
        },
      ]}
      iconCol={{ icon: "phone", value: d.phone }}
    />
  );
}
