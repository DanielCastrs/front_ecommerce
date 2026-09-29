import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import { GET_ME } from "../graphql/queries/me";
import { Loading } from "../components/Feedback/ErrorMessage";

interface MeData {
  me: { id: string; name: string; email: string; role: string };
}

// Barreira de UX: a segurança real está no backend (RolesGuard).
export function AdminRoute() {
  const token = localStorage.getItem("accessToken");
  const { data, loading } = useQuery<MeData>(GET_ME, { skip: !token });

  if (!token) return <Navigate to="/login" replace />;
  if (loading) return <Loading message="Verificando permissão..." />;
  if (data?.me.role !== "ADMIN") return <Navigate to="/" replace />;

  return <Outlet />;
}
