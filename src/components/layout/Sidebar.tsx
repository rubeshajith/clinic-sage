import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Bell,
  LogOut,
  Activity,
  Stethoscope,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logoutUser } from "../../store/slices/authSlice";
import styles from "./Sidebar.module.css";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/patients", icon: Users, label: "Patients" },
  { to: "/doctors", icon: Stethoscope, label: "Doctors" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/notifications", icon: Bell, label: "Alerts" },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const unread = useAppSelector(
    (s) => s.notifications.notifications.filter((n) => !n.read).length,
  );

  const role =
    user?.email?.split("@")[0].toLocaleLowerCase() === "doctor"
      ? "Doctor"
      : "Admin";

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Activity size={22} strokeWidth={1.5} />
        <span>Clinic Sage</span>
      </div>

      <nav className={styles.nav}>
        {NAV.filter((item) => {
          if (role === "Doctor" && item.to === "/doctors") {
            return false;
          }
          return true;
        }).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <Icon size={18} strokeWidth={1.6} />
            <span>{label}</span>
            {label === "Alerts" && unread > 0 && (
              <span className={styles.badge}>{unread}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>{user?.displayName?.[0] ?? "D"}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.displayName}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        </div>
        <button
          className={styles.logout}
          onClick={handleLogout}
          title="Sign out"
        >
          <LogOut size={16} strokeWidth={1.6} />
        </button>
      </div>
    </aside>
  );
}
