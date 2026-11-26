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
  "/logo-cepi.png";

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

export function Header({ onMenu, initials = "FN" }: { onMenu: () => void; initials?: string }) {
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
        <div className="avatar">{initials}</div>
        <ChevronDown size={14} />
      </div>
    </header>
  );
}

export function SideNav({
  view,
  setView,
  open,
  userName = "Fabricya Nayanne Santos",
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
        <a className="nav-link" href="/funcionario/turmas">
          <BookOpen size={15} /> Minhas Turmas
        </a>
        <a className="nav-link" href="/funcionario/comunicados">
          <Bell size={15} /> Avisos e comunicados
        </a>
        <a className="nav-link" href="/funcionario/academico/lancar-notas">
          <ClipboardList size={15} /> Lançamento de Notas
        </a>
        <a className="nav-link" href="/funcionario/academico/diario">
          <NotebookPen size={15} /> Diário de Classe
        </a>
        <a className="nav-link" href="/funcionario/academico/horarios">
          <CalendarDays size={15} /> Horários
        </a>
        <a className="nav-link" href="/funcionario/academico/reforco">
          <BookOpen size={15} /> Reforço / Extras
        </a>
        <a className="nav-link" href="/funcionario/academico/ocorrencias">
          <ShieldAlert size={15} /> Ocorrências
        </a>
        <a className="nav-link" href="/funcionario/calendario">
          <CalendarDays size={15} /> Calendário
        </a>
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
        <a className="nav-link" href="/funcionario/perfil">
          <UserRound size={15} /> Perfil
        </a>
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
            <a className="nav-link" href="/admin/cadastros/alunos">
              <Users size={15} /> Alunos
            </a>
            <a className="nav-link" href="/admin/cadastros/responsaveis">
              <UserRound size={15} /> Responsáveis
            </a>
            <a className="nav-link" href="/admin/turmas">
              <BookOpen size={15} /> Turmas
            </a>
            <a className="nav-link" href="/admin/cadastros/equipe">
              <Users size={15} /> Equipe
            </a>
          </div>
          <div className="nav-section">
            <span>
              COMUNICAÇÃO E CONTA <ChevronDown size={12} />
            </span>
            <a className="nav-link" href="/admin/comunicados">
              <Bell size={15} /> Avisos e comunicados
            </a>
            <a className="nav-link" href="/admin/cadastros/permissoes">
              <ShieldAlert size={15} /> Permissões de acesso
            </a>
            <a className="nav-link" href="/admin/perfil">
              <UserRound size={15} /> Perfil
            </a>
          </div>
          <div className="nav-section">
            <span>
              ACADÊMICO <ChevronDown size={12} />
            </span>
            <a className="nav-link" href="/admin/calendario">
          <CalendarDays size={15} /> Calendário
        </a>
            <a className="nav-link" href="/admin/academico/lancar-notas">
          <ClipboardList size={15} /> Lançamento de Notas
        </a>
            <a className="nav-link" href="/admin/academico/diario">
          <NotebookPen size={15} /> Diário de Classe
        </a>
            <a className="nav-link" href="/admin/academico/horarios">
          <CalendarDays size={15} /> Horários
        </a>
            <a className="nav-link" href="/admin/academico/reforco">
          <BookOpen size={15} /> Reforço / Extras
        </a>
            <a className="nav-link" href="/admin/academico/ocorrencias">
          <ShieldAlert size={15} /> Ocorrências
        </a>
          </div>
          <div className="nav-section">
            <span>
              SIMULADOS E PROVAS <ChevronDown size={12} />
            </span>
            <a className="nav-link" href="/admin/academico/banco-questoes">
          <ClipboardList size={15} /> Banco de Questões
        </a>
            <a className="nav-link" href="/admin/academico/simulados">
          <ClipboardList size={15} /> Simulados
        </a>
            <a className="nav-link" href="/admin/academico/provas">
          <ClipboardList size={15} /> Provas
        </a>
          </div>
          <div className="nav-section">
            <span>
              PORTARIA <ChevronDown size={12} />
            </span>
            <a className="nav-link" href="/admin/academico/painel">
          <ShieldAlert size={15} /> Painel ao vivo
        </a>
            <a className="nav-link" href="/admin/academico/visitantes">
          <Users size={15} /> Visitantes
        </a>
            <a className="nav-link" href="/admin/academico/saidas">
          <UserRound size={15} /> Autorizações de saída
        </a>
            <a className="nav-link" href="/admin/academico/ocorrencias">
          <ShieldAlert size={15} /> Ocorrências
        </a>
            <a className="nav-link" href="/admin/academico/historico">
          <ClipboardList size={15} /> Histórico de acesso
        </a>
          </div>
        </>
      )}
      <div className="side-user">
        <div className="avatar green">
          {userName === "Fabricya Nayanne Santos" ? "FN" : "FL"}
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
