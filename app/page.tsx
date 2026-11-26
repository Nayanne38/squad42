"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AdminDashboard } from "@/components/administrador/admin-dashboard";
import { StudentDashboard } from "@/components/aluno/student-dashboard";
import {
  Brand,
  type View,
} from "@/components/shared/platform-shell";

const cepiLogo =
  "/logo-cepi.png";

type Role = "Aluno" | "Responsável" | "Funcionário" | "Administrador";

const roleText: Record<Role, string> = {
  Aluno: "Acesse notas, horários e comunicados.",
  Responsável: "Acompanhe o desempenho do seu filho.",
  Funcionário: "Gerencie turmas, avisos e a rede social.",
  Administrador: "Acesse o painel administrativo.",
};

function RoleCard({ role, href }: { role: Role; href: string }) {
  return (
    <a className="fg-role" href={href}>
      <div>
        <strong>Sou {role.toLowerCase()}</strong>
        <small>{roleText[role]}</small>
      </div>
      <ChevronRight size={16} />
    </a>
  );
}

function Home({ go: _go }: { go: (view: View) => void }) {
  return (
    <main className="fg-split">
      <section className="fg-left">
        <div className="fg-box">
          <h1>Bem-vindo!</h1>
          <p className="fg-sub">Selecione seu perfil para acessar o sistema.</p>
          <div className="fg-roles">
            <RoleCard role="Aluno" href="/login/aluno" />
            <RoleCard role="Responsável" href="/login/responsavel" />
            <RoleCard role="Funcionário" href="/login/funcionario" />
            <RoleCard role="Administrador" href="/login/admin" />
          </div>
          <p className="fg-foot">Dentro da escola o uso do celular é restrito: acesse pelo computador.</p>
        </div>
      </section>
      <section className="fg-right" aria-label="Colégio CEPI Expansão">
        <i className="fg-tri a" /><i className="fg-tri b" /><i className="fg-tri c" />
        <img src={cepiLogo} alt="Colégio CEPI Expansão" />
      </section>
    </main>
  );
}

export default function Page() {
  const [view, setView] = useState<View>("home");

  if (view === "home") return <Home go={setView} />;
  if (view === "admin") {
    return <AdminDashboard onBack={() => setView("home")} />;
  }

  return (
    <StudentDashboard
      role={view === "responsible" ? "responsible" : "student"}
      onBack={() => setView("home")}
    />
  );
}
