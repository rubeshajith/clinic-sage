import { useCallback, useEffect, useMemo, useRef } from "react";
import { Search, Filter } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setViewMode, setSearchQuery, setFilterStatus } from "../patientSlice";
import PatientCard from "../components/PatientCard";
import PatientRow from "../components/PatientRow";
import ViewToggle from "../components/ViewToggle";
import styles from "./PatientsPage.module.css";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

const STATUSES = ["All", "Active", "Critical", "Recovered", "Discharged"];

export default function PatientsPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = location.state?.highlight;
  const { patients, viewMode, searchQuery, filterStatus } = useAppSelector(
    (s) => s.patients,
  );

  const highlightRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return patients.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.condition.toLowerCase().includes(query);
      const matchStatus = filterStatus === "All" || p.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [patients, searchQuery, filterStatus]);

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
  // On mount: apply status filter from URL
  useEffect(() => {
    const status = searchParams.get("status");

    if (highlightId) {
      dispatch(setFilterStatus("All"));
    } else if (status) {
      dispatch(setFilterStatus(status));
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
      navigate("/patients", { replace: true });
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
          <h1>Patients</h1>
          <p className={styles.sub}>
            {filtered.length} patients{" "}
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
          {filtered.map((p) => (
            <div
              key={p.id}
              ref={p.id === highlightId ? highlightRef : null}
              className={`${styles.cardWrapper} ${
                p.id === highlightId ? styles.highlighted : ""
              }`}
            >
              <PatientCard patient={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Patient</span>
            <span>Age</span>
            <span>Condition</span>
            <span>Ward</span>
            <span>Doctor</span>
            <span>Vitals</span>
            <span>Blood</span>
            <span>Status</span>
          </div>
          {filtered.map((p) => (
            <PatientRow key={p.id} patient={p} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>
            No patients found for "<strong>{searchQuery}</strong>"
          </p>
        </div>
      )}
    </div>
  );
}
