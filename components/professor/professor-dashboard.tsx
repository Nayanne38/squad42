"use client";

import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  NotebookPen,
  ShieldAlert,
} from "lucide-react";
import { Header, SideNav } from "@/components/shared/platform-shell";

export function ProfessorDashboard({ onBack }: { onBack: () => void }) {
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
          <div className="stats">
            <div>
              <BookOpen size={18} />
              <b>4</b>
              <span>Turmas</span>
            </div>
            <div>
              <ClipboardList size={18} />
              <b>28</b>
              <span>Alunos</span>
            </div>
            <div>
              <CalendarDays size={18} />
              <b>6</b>
              <span>Aulas hoje</span>
            </div>
          </div>
          <div className="admin-card">
            <div className="card-title">
              <NotebookPen size={15} /> Acesso rápido
            </div>
            <div className="admin-links">
              <button>
                <BookOpen size={16} /> Turmas
              </button>
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
            <div className="empty">Nenhuma aula registrada para hoje.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
