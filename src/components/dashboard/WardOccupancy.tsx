import styles from "./WardOccupancy.module.css";

interface Ward {
  name: string;
  occupied: number;
  total: number;
  color: string;
}

const WARDS: Ward[] = [
  { name: "ICU", occupied: 8, total: 10, color: "#C12B2B" },
  { name: "Cardiology", occupied: 18, total: 20, color: "#4E8B6A" },
  { name: "Surgery", occupied: 12, total: 15, color: "#2B52C1" },
  { name: "Pulmonology", occupied: 9, total: 14, color: "#7A5A00" },

  { name: "Orthopedics", occupied: 10, total: 16, color: "#4E8B6A" },
];

function getStatus(pct: number): { label: string; cls: string } {
  if (pct >= 90) return { label: "Critical", cls: "critical" };
  if (pct >= 70) return { label: "High", cls: "high" };
  return { label: "Normal", cls: "normal" };
}

export default function WardOccupancy() {
  const totalBeds = WARDS.reduce((s, w) => s + w.total, 0);
  const totalOccupied = WARDS.reduce((s, w) => s + w.occupied, 0);
  const totalFree = totalBeds - totalOccupied;
  const overallPct = Math.round((totalOccupied / totalBeds) * 100);

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div>
          <h3>Ward Occupancy</h3>
          <p className={styles.subtitle}>Live bed availability</p>
        </div>
        <div className={styles.overallBadge}>
          <span className={styles.overallPct}>{overallPct}%</span>
          <span className={styles.overallLabel}>full</span>
        </div>
      </div>

      {/* Summary chips */}
      <div className={styles.summaryRow}>
        <div className={styles.chip}>
          <span className={styles.chipDot} style={{ background: "#C12B2B" }} />
          <span className={styles.chipVal}>{totalOccupied}</span>
          <span className={styles.chipLabel}>Occupied</span>
        </div>
        <div className={styles.chipDivider} />
        <div className={styles.chip}>
          <span className={styles.chipDot} style={{ background: "#4E8B6A" }} />
          <span className={styles.chipVal}>{totalFree}</span>
          <span className={styles.chipLabel}>Available</span>
        </div>
        <div className={styles.chipDivider} />
        <div className={styles.chip}>
          <span className={styles.chipDot} style={{ background: "#7A8F85" }} />
          <span className={styles.chipVal}>{totalBeds}</span>
          <span className={styles.chipLabel}>Total Beds</span>
        </div>
      </div>

      {/* Ward rows */}
      <div className={styles.wardList}>
        {WARDS.map((ward) => {
          const pct = Math.round((ward.occupied / ward.total) * 100);
          const status = getStatus(pct);
          const free = ward.total - ward.occupied;

          return (
            <div key={ward.name} className={styles.wardRow}>
              <div className={styles.wardMeta}>
                <div className={styles.wardLeft}>
                  <span
                    className={styles.wardDot}
                    style={{ background: ward.color }}
                  />
                  <span className={styles.wardName}>{ward.name}</span>
                </div>
                <div className={styles.wardRight}>
                  <span
                    className={`${styles.statusBadge} ${styles[status.cls]}`}
                  >
                    {status.label}
                  </span>
                  <span className={styles.wardCount}>
                    {ward.occupied}
                    <span className={styles.wardTotal}>/{ward.total}</span>
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${pct}%`, background: ward.color }}
                />
              </div>

              <div className={styles.wardFooter}>
                <span className={styles.wardFree}>
                  {free} bed{free !== 1 ? "s" : ""} free
                </span>
                <span className={styles.wardPct}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
