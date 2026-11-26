"use client";

import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  NotebookPen,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { SocialCta } from "@/components/shared/social-cta";
import { Header, SideNav } from "@/components/shared/platform-shell";
import {
  CURRENT_STAFF_ID,
  getClassesOfStaff,
  getStudentsOfClass,
  staffLessonsToday,
} from "@/data/shared/school";

export function ProfessorDashboard({ onBack }: { onBack: () => void }) {
  const myClasses = getClassesOfStaff(CURRENT_STAFF_ID);
  const myStudents = myClasses.reduce((total, item) => total + getStudentsOfClass(item.id).length, 0);
  return (
    <div className="admin-shell">
      <SideNav
        view="admin"
        setView={onBack}
        open={false}
        userName="Fernanda Lima"
        userEmail="fernanda.lima@zenixeducation.com..."
        professor
      />
      <div className="admin-main">
        <Header onMenu={() => {}} />
        <div className="admin-content">
          <div className="admin-title">
            <div>
              <h1>Olá, Fernanda 👋</h1>
              <p>Aqui está um resumo das suas atividades de hoje.</p>
            </div>
            <div className="admin-title-actions">
              <button className="outline-button" onClick={onBack}>
                Sair
              </button>
            </div>
          </div>
          <SocialCta role="funcionario" />
          <div className="stats">
            <div>
              <BookOpen size={18} />
              <b>{myClasses.length}</b>
              <span>Turmas</span>
            </div>
            <div>
              <ClipboardList size={18} />
              <b>{myStudents}</b>
              <span>Alunos</span>
            </div>
            <div>
              <CalendarDays size={18} />
              <b>{staffLessonsToday.length}</b>
              <span>Aulas hoje</span>
            </div>
          </div>
          <div className="admin-card">
            <div className="card-title">
              <NotebookPen size={15} /> Acesso rápido
            </div>
            <div className="admin-links">
              <Link href="/funcionario/turmas">
                <BookOpen size={16} /> Turmas
              </Link>
              <Link href="/funcionario/comunicados">
                <ClipboardList size={16} /> Publicar avisos
              </Link>
              <Link href="/funcionario/perfil">
                <NotebookPen size={16} /> Meu perfil
              </Link>
              <button>
                <ClipboardList size={16} /> Lançamento de Notas
              </button>
              <button>
                <NotebookPen size={16} /> Diário de Classe
              </button>
              <button>
                <CalendarDays size={16} /> Horários
              </button>
              <button>
                <BookOpen size={16} /> Reforço / Extras
              </button>
              <button>
                <ShieldAlert size={16} /> Ocorrências
              </button>
            </div>
          </div>
          <div className="admin-card">
            <div className="card-title">
              <CalendarDays size={15} /> Próximas aulas
            </div>
            {staffLessonsToday.length === 0 ? (
              <div className="empty">Nenhuma aula registrada para hoje.</div>
            ) : (
              <div style={{ display: "grid", gap: 8, padding: "6px 0" }}>
                {staffLessonsToday.map((lesson) => (
                  <div key={lesson.time} style={{ fontSize: 13 }}>
                    <b>{lesson.time}</b> · {lesson.className} · {lesson.subject} ({lesson.room})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
