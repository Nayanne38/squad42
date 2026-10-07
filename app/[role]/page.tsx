"use client";

import { useParams } from "next/navigation";
import { AreaDashboard } from "../page";

export default function AreaPage() {
  const { role } = useParams<{ role: string }>();
  const validArea =
    role === "admin" ||
    role === "aluno" ||
    role === "responsavel" ||
    role === "funcionario"
      ? role
      : "aluno";
  return <AreaDashboard area={validArea} />;
}
