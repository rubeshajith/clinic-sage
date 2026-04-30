import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAppSelector } from "../hooks/redux";
import {
  AGE_GROUPS,
  ANALYTICS_DATA,
  DOCTOR_WORKLOAD,
  GENDER_SPLIT,
  WARD_DISTRIBUTION,
} from "../utils/mockData";
import styles from "./AnalyticsPage.module.css";

const COLORS = [
  "#4E8B6A",
  "#1B3A2E",
  "#7A8F85",
  "#A8C5B5",
  "#D0E4DA",
  "#E8F2ED",
];

export default function AnalyticsPage() {
  const patients = useAppSelector((s) => s.patients.patients);
  const user = useAppSelector((s) => s.auth.user);
  const role =
    user?.email?.split("@")[0].toLocaleLowerCase() === "doctor"
      ? "Doctor"
      : "Admin";

  const statusCounts = {
    Active: patients.filter((p) => p.status === "Active").length,
    Critical: patients.filter((p) => p.status === "Critical").length,
    Recovered: patients.filter((p) => p.status === "Recovered").length,
    Discharged: patients.filter((p) => p.status === "Discharged").length,
  };

  const avgAge = Math.round(
    patients.reduce((a, p) => a + p.age, 0) / patients.length,
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Analytics</h1>
        <p className={styles.sub}>Clinical insights · Last 7 months</p>
      </div>

      <div className={styles.kpiRow}>
        {[
          ["Avg. Patient Age", `${avgAge} yrs`],
          ["Recovery Rate", "76%"],
          ["Bed Occupancy", "84%"],
          ["Avg. Stay", "6.4 days"],
        ].map(([label, val]) => (
          <div key={label} className={styles.kpi}>
            <span className={styles.kpiLabel}>{label}</span>
            <span className={styles.kpiVal}>{val}</span>
          </div>
        ))}
      </div>

      <div className={styles.row}>
        <div className={styles.chartCard}>
          <h3>Admissions vs Discharges</h3>
          <p className={styles.chartSub}>Monthly patient flow</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={ANALYTICS_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4E8B6A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4E8B6A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="disGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B3A2E" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1B3A2E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F0EC" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#7A8F85" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#7A8F85" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #D8E4DE",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="admissions"
                stroke="#4E8B6A"
                strokeWidth={2}
                fill="url(#admGrad)"
                name="Admissions"
              />
              <Area
                type="monotone"
                dataKey="discharges"
                stroke="#1B3A2E"
                strokeWidth={2}
                fill="url(#disGrad)"
                name="Discharges"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Ward Distribution</h3>
          <p className={styles.chartSub}>Patients by department</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={WARD_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {WARD_DISTRIBUTION.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #D8E4DE",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.chartCard}>
          <h3>Critical Cases Trend</h3>
          <p className={styles.chartSub}>Monthly critical patient count</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={ANALYTICS_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F0EC" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#7A8F85" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#7A8F85" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #D8E4DE",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="critical"
                fill="#C12B2B"
                radius={[4, 4, 0, 0]}
                name="Critical"
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3>Patient Status Breakdown</h3>
          <p className={styles.chartSub}>Current status distribution</p>
          <div className={styles.statusList}>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className={styles.statusItem}>
                <div className={styles.statusLabel}>
                  <span className={`badge badge--${status.toLowerCase()}`}>
                    {status}
                  </span>
                </div>
                <div className={styles.barWrap}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${(count / patients.length) * 100}%` }}
                  />
                </div>
                <span className={styles.statusCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.row}>
        {/* Doctor Workload */}
        {role === "Admin" && (
          <div className={styles.chartCard}>
            <h3>Doctor Workload</h3>
            <p className={styles.chartSub}>Patients handled per doctor</p>

            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={DOCTOR_WORKLOAD}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F0EC" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#7A8F85" }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: "#7A8F85" }}
                  width={100}
                />
                <Tooltip />
                <Bar dataKey="patients" fill="#4E8B6A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Demographics */}
        <div className={styles.chartCard}>
          <h3>Patient Demographics</h3>
          <p className={styles.chartSub}>Gender & Age distribution</p>

          <div className={styles.dualDonut}>
            {/* Gender */}
            <div className={styles.donutBlock}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={GENDER_SPLIT}
                    innerRadius={45}
                    outerRadius={65}
                    dataKey="value"
                  >
                    {GENDER_SPLIT.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <span className={styles.donutLabel}>Gender</span>
            </div>

            {/* Age */}
            <div className={styles.donutBlock}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={AGE_GROUPS}
                    innerRadius={45}
                    outerRadius={65}
                    dataKey="value"
                  >
                    {AGE_GROUPS.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <span className={styles.donutLabel}>Age Groups</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
