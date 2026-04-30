import { Phone, Mail, Droplets, User } from "lucide-react";
import styles from "./EntityCard.module.css";

export interface VitalItem {
  key: string;
  value: string;
  alert?: boolean;
}

export interface MetaField {
  label: string;
  value: string;
}

export interface FooterItem {
  icon: "phone" | "mail" | "droplet";
  value: string;
}

export interface EntityCardProps {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: string;
  subtitle: string;
  subtitleValue: string;
  metaFields: MetaField[];
  vitals?: VitalItem[];
  footerLeft?: FooterItem;
  footerRight?: FooterItem;
}

function FooterIcon({ icon }: { icon: FooterItem["icon"] }) {
  if (icon === "phone") return <Phone size={12} />;
  if (icon === "mail") return <Mail size={12} />;
  return <Droplets size={12} />;
}

export default function EntityCard({
  id,
  name,
  age,
  gender,
  status,
  subtitle,
  subtitleValue,
  metaFields,
  vitals,
  footerLeft,
  footerRight,
}: EntityCardProps) {
  const statusClass = status.toLowerCase().replace(" ", "-");

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <User size={18} strokeWidth={1.4} />
        </div>
        <div className={styles.identity}>
          <strong>{name}</strong>
          <span>
            {id} · {age}y · {gender}
          </span>
        </div>
        <span className={`badge badge--${statusClass}`}>{status}</span>
      </div>

      <div className={styles.condition}>
        <span className={styles.condLabel}>{subtitle}</span>
        <span>{subtitleValue}</span>
      </div>

      <div
        className={styles.meta}
        style={{
          gridTemplateColumns: `repeat(${metaFields.length}, 1fr)`,
        }}
      >
        {metaFields.map((field) => (
          <div key={field.label} className={styles.metaItem}>
            <span className={styles.metaLabel}>{field.label}</span>
            <span>{field.value}</span>
          </div>
        ))}
      </div>

      {vitals && vitals.length > 0 && (
        <div
          className={styles.vitals}
          style={{
            gridTemplateColumns: `repeat(${Math.min(vitals.length, 4)}, 1fr)`,
          }}
        >
          {vitals.map((v) => (
            <div
              key={v.key}
              className={`${styles.vital} ${v.alert ? styles.vitalAlert : ""}`}
            >
              <span className={styles.vitalKey}>{v.key}</span>
              <span className={styles.vitalVal}>{v.value}</span>
            </div>
          ))}
        </div>
      )}

      {(footerLeft || footerRight) && (
        <div className={styles.footer}>
          {footerLeft && (
            <div className={styles.footerItem}>
              <FooterIcon icon={footerLeft.icon} />
              {footerLeft.value}
            </div>
          )}
          {footerRight && (
            <div className={styles.footerItem}>
              <FooterIcon icon={footerRight.icon} />
              {footerRight.value}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
