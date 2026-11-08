"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/administrador/admin-dashboard";
import { StudentDashboard } from "@/components/aluno/student-dashboard";
import { ProfessorDashboard } from "@/components/professor/professor-dashboard";

export function AreaDashboard({
  area,
}: {
  area: "admin" | "aluno" | "responsavel" | "funcionario";
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem("zenix-demo-session");
    const expected = area === "admin" ? "admin" : area;

    if (session === expected) {
      setAuthorized(true);
    } else {
      router.replace("/");
    }
  }, [area, router]);

  function logout() {
    sessionStorage.removeItem("zenix-demo-session");
    router.replace("/");
  }

  if (!authorized) return null;
  if (area === "admin") return <AdminDashboard onBack={logout} />;
  if (area === "funcionario") return <ProfessorDashboard onBack={logout} />;

  return (
    <StudentDashboard
      role={area === "responsavel" ? "responsible" : "student"}
      onBack={logout}
    />
  );
}
