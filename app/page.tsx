"use client";

import { useState } from "react";
import {
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Users,
} from "lucide-react";
import { AdminDashboard } from "@/components/administrador/admin-dashboard";
import { StudentDashboard } from "@/components/aluno/student-dashboard";
import {
  Brand,
  type View,
} from "@/components/shared/platform-shell";

const cepiLogo =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7Ezo2vTuYX5AbUDY3GNV6xgjvUfGqs.png";

type Role = "Aluno" | "Responsável" | "Funcionário";

function RoleCard({
  role,
  icon: Icon,
  color,
  href,
}: {
  role: Role;
  icon: typeof GraduationCap;
  color: string;
  href: string;
}) {
  return (
    <a className="role-card" href={href}>
      <div className={`role-icon ${color}`}>
        <Icon size={23} />
      </div>
      <div>
        <strong>Sou {role}</strong>
        <small>
          {role === "Aluno"
            ? "Acesse notas, horários e comunicados"
            : role === "Responsável"
              ? "Acompanhe o desempenho do seu filho"
              : "Acesse o painel administrativo"}
        </small>
      </div>
      <ChevronRight size={19} />
    </a>
  );
}

function Home({ go: _go }: { go: (view: View) => void }) {
  return (
    <main className="landing">
      <section className="landing-copy">
        <Brand />
        <div className="award">
          ♨ <b>43 Anos de Excelência</b>
        </div>
        <h1>
          Bem-vindo ao
          <br />
          Zenix Education
        </h1>
        <p>Selecione seu perfil para acessar o sistema</p>
        <div className="roles">
          <RoleCard
            role="Aluno"
            icon={GraduationCap}
            color="green"
            href="/login/aluno"
          />
          <RoleCard
            role="Responsável"
            icon={Users}
            color="cyan"
            href="/login/responsavel"
          />
          <RoleCard
            role="Funcionário"
            icon={ClipboardList}
            color="olive"
            href="/login/funcionario"
          />
        </div>
        <footer>© 2025 Zenix Education · Todos os direitos reservados</footer>
      </section>
      <section
        className="landing-image"
        aria-label="Área institucional do Colégio CEPI"
      >
        <div className="institutional-panel">
          <img src={cepiLogo} alt="Colégio CEPI Expansão" />
          <span>Educação que transforma</span>
        </div>
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
