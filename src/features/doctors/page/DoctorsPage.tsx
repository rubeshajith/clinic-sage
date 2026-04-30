import { useCallback, useEffect, useMemo, useRef } from "react";
import { Search, Filter } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

import styles from "./DoctorsPage.module.css";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import { setFilterStatus, setSearchQuery, setViewMode } from "../doctorSlice";

import ViewToggle from "../../patients/components/ViewToggle";
import DoctorCard from "../components/DoctorCard";
import DoctorRow from "../components/DoctorRow";

const STATUSES = ["All", "Active", "Inactive", "On Leave"];

export default function DoctorsPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = location.state?.highlight;
  const { doctors, viewMode, searchQuery, filterStatus } = useAppSelector(
    (s) => s.doctors,
  );

  const highlightRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return doctors.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(query) ||
        d.id.toLowerCase().includes(query) ||
        d.specialty.toLowerCase().includes(query);
      const matchStatus = filterStatus === "All" || d.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [doctors, searchQuery, filterStatus]);

  const handleViewChange = useCallback(
    (m: "grid" | "list") => {
      dispatch(setViewMode(m));
    },
    [dispatch],
  );
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchQuery(e.target.value));
    },
    [dispatch],
  );
  // On mount: apply status filter from dashboard URL param
  useEffect(() => {
    const status = searchParams.get("status");
    const nomalizeStatus =
      status === "active"
        ? "Active"
        : status === "inactive"
          ? "Inactive"
          : status === "leave"
            ? "On Leave"
            : "All";
    if (highlightId) {
      dispatch(setFilterStatus("All"));
    } else if (status) {
      dispatch(setFilterStatus(nomalizeStatus));
    }
  }, [highlightId]);
  // When highlight param is present: force grid view, scroll to card, clear param after
  useEffect(() => {
    if (!highlightId) return;

    dispatch(setViewMode("grid"));

    const timer = setTimeout(() => {
      if (highlightRef.current) {
        highlightRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
    const clearTimer = setTimeout(() => {
      navigate("/doctors", { replace: true });
    }, 2500);
    return () => {
      clearTimeout(timer);
      clearTimeout(clearTimer);
    };
  }, [highlightId]);

  useEffect(() => {
    // On smaller screens, default to grid view for better readability
    const handleResize = () => {
      if (window.innerWidth < 900) {
        dispatch(setViewMode("grid"));
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Doctors</h1>
          <p className={styles.sub}>
            {filtered.length} doctors{" "}
            {filterStatus !== "All" ? `· ${filterStatus}` : "total"}
          </p>
        </div>
        <ViewToggle mode={viewMode} onChange={handleViewChange} />
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={15} strokeWidth={1.6} />
          <input
            type="text"
            placeholder="Search by name, ID, or condition…"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className={styles.filters}>
          <Filter
            size={14}
            strokeWidth={1.6}
            style={{ color: "var(--secondary)" }}
          />
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`${styles.filterBtn} ${filterStatus === s ? styles.filterActive : ""}`}
              onClick={() => dispatch(setFilterStatus(s))}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className={styles.grid}>
          {filtered.map((d) => (
            <div
              key={d.id}
              ref={d.id === highlightId ? highlightRef : null}
              className={`${styles.cardWrapper} ${
                d.id === highlightId ? styles.highlighted : ""
              }`}
            >
              <DoctorCard doctor={d} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Doctor</span>
            <span>Age</span>
            <span>Specialty</span>
            <span>Department</span>
            <span>Experience</span>
            <span>Schedule</span>
            <span>Phone</span>
            <span>Status</span>
          </div>
          {filtered.map((d) => (
            <DoctorRow key={d.id} doctor={d} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>
            No doctors found for "<strong>{searchQuery}</strong>"
          </p>
        </div>
      )}
    </div>
  );
}
