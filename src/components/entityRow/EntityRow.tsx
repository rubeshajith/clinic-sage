import { Phone, Mail, Droplet } from "lucide-react";
import styles from "./EntityRow.module.css";

export interface RowColumn {
  value: string;
  alert?: boolean;
  secondary?: boolean;
  /** renders value stacked on two lines split by " / " */
  stacked?: boolean;
}

export interface RowFooterIcon {
  icon: "phone" | "mail" | "droplet";
  value: string;
}

export interface EntityRowProps {
  id: string;
  name: string;
  /** Extra columns rendered between identity and the badge */
  columns: RowColumn[];
  status: string;
  /** Icon + value shown before the status badge */
  iconCol?: RowFooterIcon;
  /** Total grid columns count — drives grid-template-columns */
  gridCols?: number;
}

function RowIcon({ icon }: { icon: RowFooterIcon["icon"] }) {
  if (icon === "phone") return <Phone size={12} />;
  if (icon === "mail") return <Mail size={12} />;
  return <Droplet size={12} />;
}

export default function EntityRow({
  id,
  name,
  columns,
  status,
  iconCol,
  gridCols,
}: EntityRowProps) {
  const statusClass = status.toLowerCase().replace(" ", "-");

  // auto-calculate if not provided: identity + columns + iconCol? + badge
  const totalCols = gridCols ?? 2 + columns.length + (iconCol ? 1 : 0) + 1;
  const colTemplate = `2fr 0.5fr ${"1fr ".repeat(totalCols - 3).trim()} 0.8fr`;

  return (
    <div className={styles.row} style={{ gridTemplateColumns: colTemplate }}>
      {/* Identity */}
      <div className={styles.identity}>
        <div className={styles.avatar}>{name[0]}</div>
        <div>
          <strong>{name}</strong>
          <span>{id}</span>
        </div>
      </div>

      {/* Dynamic columns */}
      {columns.map((col, i) => {
        if (col.stacked) {
          const [top, bottom] = col.value.split(" / ");
          return (
            <div key={i} className={styles.stackedCol}>
              <span>{top}</span>
              <span className={styles.sub}>{bottom}</span>
            </div>
          );
        }
        return (
          <div
            key={i}
            className={`${col.secondary ? styles.secondary : ""} ${col.alert ? styles.alertVal : ""}`}
          >
            {col.value}
          </div>
        );
      })}

      {/* Optional icon column (blood group / email / phone) */}
      {iconCol && (
        <div className={styles.iconCol}>
          <RowIcon icon={iconCol.icon} />
          {iconCol.value}
        </div>
      )}

      {/* Status badge */}
      <span
        className={`badge badge--${statusClass}`}
        style={{ width: "fit-content" }}
      >
        {status}
      </span>
    </div>
  );
}
