import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAppSelector((s) => s.auth);

  if (loading) {
    return null; // or a loader/spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
