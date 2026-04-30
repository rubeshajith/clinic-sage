import EntityCard from "../../../components/entityCard/EntityCard";
import { Doctor } from "../../../types";

interface Props {
  doctor: Doctor;
}

export default function DoctorCard({ doctor: d }: Props) {
  return (
    <EntityCard
      id={d.id}
      name={d.name}
      age={d.age}
      gender={d.gender}
      status={d.status}
      subtitle="Specialty"
      subtitleValue={d.specialty}
      metaFields={[
        { label: "Dept", value: d.department },
        { label: "Experience", value: `${d.experience} yrs` },
        { label: "Schedule", value: d.schedule },
      ]}
      vitals={[
        { key: "Patients", value: `${d.patientsAssigned}` },
        { key: "Qual", value: d.qualification },
      ]}
      footerLeft={{ icon: "mail", value: d.email }}
      footerRight={{ icon: "phone", value: d.phone }}
    />
  );
}
