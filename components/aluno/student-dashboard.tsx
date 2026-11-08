"use client";

import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Megaphone,
  MessageCircle,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { Brand } from "@/components/shared/platform-shell";

const quickItems = [
  ["Comunicados", "Avisos e comunicados", Megaphone, "blue"],
  ["Notas", "Boletim por bimestre", ClipboardList, "green"],
  ["Horários", "Grade de aulas", CalendarDays, "purple"],
  ["Calendário", "Eventos e feriados", CalendarDays, "indigo"],
  ["Agenda de aulas", "Registros de aulas", BookOpen, "teal"],
  ["Ocorrências", "Registros disciplinares", ShieldAlert, "orange"],
  ["Perfil", "Dados do aluno", Settings, "slate"],
] as const;

export function StudentDashboard({
  role,
  onBack,
}: {
  role: "student" | "responsible";
  onBack: () => void;
}) {
  const isParent = role === "responsible";

  return (
    <div className="portal">
      <div className="portal-head">
        <Brand compact />
        <div className="portal-profile">
          <span>{isParent ? "RM" : "AM"}</span>
          <ChevronDown size={14} />
        </div>
      </div>
      {isParent ? (
        <>
          <div className="welcome blue-bg">
            <div className="big-avatar">RM</div>
            <div>
              <small>Portal do Responsável</small>
              <h2>Olá, Responsável!</h2>
              <p>1 aluno vinculado</p>
            </div>
          </div>
          <label className="eyebrow">SELECIONE O ALUNO</label>
          <button className="student-select">
            <div className="big-avatar small">AM</div>
            <b>
              Aluno Modelo
              <br />
              <small>RA 20260011</small>
            </b>
            <span>Mãe</span>
          </button>
        </>
      ) : (
        <div className="welcome green-bg">
          <div className="big-avatar">Z</div>
          <div>
            <small>Bem-vindo de volta</small>
            <h2>Aluno Modelo 101</h2>
            <p>
              RA: <b>20260011</b>
            </p>
          </div>
        </div>
      )}
      <div className="portal-card">
        {isParent ? (
          <div className="student-row">
            <div className="big-avatar small">AM</div>
            <div>
              <b>Aluno Modelo 101</b>
              <small>RA: 20260011</small>
              <span>Pedagógico　 Mãe</span>
            </div>
          </div>
        ) : (
          <div className="card-title">
            <Megaphone size={16} /> Comunicados recentes <a>Ver todos →</a>
          </div>
        )}
        <div className="card-title quick-title">ACESSO RÁPIDO</div>
        <div className="quick-grid">
          {!isParent && (
            <a
              href="/aluno/rede-social/feed"
              className="quick-item social-quick-item"
            >
              <div className="quick-icon social-quick-icon">
                <MessageCircle size={17} />
              </div>
              <div>
                <b>Rede Social Escolar</b>
                <small>
                  Feed, murais, grupos e comunicação com a comunidade escolar
                </small>
              </div>
              <ChevronRight size={15} />
            </a>
          )}
          {quickItems.map(([name, description, Icon, color]) => (
            <button key={name} className="quick-item">
              <div className={`quick-icon ${color}`}>
                <Icon size={17} />
              </div>
              <div>
                <b>{name}</b>
                <small>{description}</small>
              </div>
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </div>
      <a
        className="back-button"
        href={`/ ${isParent ? "responsavel" : "aluno"}/rede-social/feed`.replace(
          " ",
          "",
        )}
      >
        Abrir Rede Social Escolar
      </a>
      <button className="back-button" onClick={onBack}>
        Sair
      </button>
      <footer className="portal-footer">Desenvolvido por ZenixCode</footer>
    </div>
  );
}
