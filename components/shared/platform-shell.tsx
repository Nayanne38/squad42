"use client";

import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  MessageCircle,
  Menu,
  NotebookPen,
  Search,
  ShieldAlert,
  UserRound,
  Users,
  X,
} from "lucide-react";

const cepiLogo =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7Ezo2vTuYX5AbUDY3GNV6xgjvUfGqs.png";

export type View = "home" | "student" | "responsible" | "admin";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <div className="brand-mark">
        <img src={cepiLogo} alt="Colégio CEPI Expansão" />
      </div>
      {!compact && (
        <div>
          <strong>ZENIX EDUCATION</strong>
          <small>Sistema de Gestão Escolar</small>
        </div>
      )}
    </div>
  );
}

export function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Abrir menu">
        <Menu size={20} />
      </button>
      <Brand compact />
      <div className="search">
        <Search size={15} />
        <span>Para onde você quer ir?</span>
      </div>
      <div className="top-actions">
        <Bell size={18} />
        <div className="avatar">RM</div>
        <ChevronDown size={14} />
      </div>
    </header>
  );
}

export function SideNav({
  view,
  setView,
  open,
  userName = "Administrador Modelo",
  userEmail = "admin@zenixeducation.com...",
  professor = false,
}: {
  view: View;
  setView: (view: View) => void;
  open: boolean;
  userName?: string;
  userEmail?: string;
  professor?: boolean;
}) {
  const professorMenu = (
    <>
      <div className="nav-section">
        <span>
          PROFESSOR <ChevronDown size={12} />
        </span>
        <button>
          <BookOpen size={15} /> Minhas Turmas
        </button>
        <button>
          <ClipboardList size={15} /> Lançamento de Notas
        </button>
        <button>
          <NotebookPen size={15} /> Diário de Classe
        </button>
        <button>
          <CalendarDays size={15} /> Horários
        </button>
        <button>
          <BookOpen size={15} /> Reforço / Extras
        </button>
        <button>
          <ShieldAlert size={15} /> Ocorrências
        </button>
        <button>
          <CalendarDays size={15} /> Calendário
        </button>
      </div>
      <div className="nav-section">
        <span>
          COMUNIDADE <ChevronDown size={12} />
        </span>
        <a className="nav-link" href="/funcionario/rede-social/feed">
          <MessageCircle size={15} /> Rede Social Escolar
        </a>
      </div>
      <div className="nav-section">
        <span>
          CONTA <ChevronDown size={12} />
        </span>
        <button>
          <UserRound size={15} /> Perfil
        </button>
      </div>
    </>
  );

  return (
    <aside className={`sidenav ${open ? "open" : ""}`}>
      <div className="side-brand">
        <Brand />
      </div>
      <button
        className="close-nav"
        onClick={() => setView(view)}
        aria-label="Fechar menu"
      >
        <X size={18} />
      </button>
      {professor ? (
        professorMenu
      ) : (
        <>
          <div className="nav-section">
            <span>
              CADASTRO <ChevronDown size={12} />
            </span>
            <button>
              <Users size={15} /> Alunos
            </button>
            <button>
              <UserRound size={15} /> Responsáveis
            </button>
            <button>
              <BookOpen size={15} /> Turmas
            </button>
          </div>
          <div className="nav-section">
            <span>
              ACADÊMICO <ChevronDown size={12} />
            </span>
            <button>
              <CalendarDays size={15} /> Calendário
            </button>
            <button>
              <ClipboardList size={15} /> Lançamento de Notas
            </button>
            <button>
              <NotebookPen size={15} /> Diário de Classe
            </button>
            <button>
              <CalendarDays size={15} /> Horários
            </button>
            <button>
              <BookOpen size={15} /> Reforço / Extras
            </button>
            <button>
              <ShieldAlert size={15} /> Ocorrências
            </button>
          </div>
          <div className="nav-section">
            <span>
              SIMULADOS E PROVAS <ChevronDown size={12} />
            </span>
            <button>
              <ClipboardList size={15} /> Banco de Questões
            </button>
            <button>
              <ClipboardList size={15} /> Simulados
            </button>
            <button>
              <ClipboardList size={15} /> Provas
            </button>
          </div>
          <div className="nav-section">
            <span>
              PORTARIA <ChevronDown size={12} />
            </span>
            <button>
              <ShieldAlert size={15} /> Painel ao vivo
            </button>
            <button>
              <Users size={15} /> Visitantes
            </button>
            <button>
              <UserRound size={15} /> Autorizações de saída
            </button>
            <button>
              <ShieldAlert size={15} /> Ocorrências
            </button>
            <button>
              <ClipboardList size={15} /> Histórico de acesso
            </button>
          </div>
        </>
      )}
      <div className="side-user">
        <div className="avatar green">
          {userName === "Administrador Modelo" ? "AM" : "FL"}
        </div>
        <div>
          <b>{userName}</b>
          <small>{userEmail}</small>
        </div>
      </div>
      <button className="logout" onClick={() => setView(view)}>
        ↪ Sair
      </button>
    </aside>
  );
}
