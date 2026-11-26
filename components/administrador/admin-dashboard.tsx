"use client";

import { SocialCta } from "@/components/shared/social-cta";
import {
  BookOpen,
  ChevronDown,
  MessageCircle,
  Settings,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Header, SideNav } from "@/components/shared/platform-shell";
import {
  getRegistrationNotices,
  getUpcomingBirthdays,
  guardians,
  staff,
  students,
} from "@/data/shared/school";

const adminLinks: [string, string][] = [
  ["Turmas", "/direcao/turmas"],
  ["Enviar comunicado", "/direcao/comunicados"],
  ["Moderação da comunidade", "/direcao/rede-social/moderacao"],
  ["Relatórios", "/direcao/rede-social/relatorios"],
  ["Ocorrências", "/direcao/academico/ocorrencias"],
  ["Provas e simulados", "/direcao/academico/provas"],
];

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  const notices = getRegistrationNotices();
  const totalNotices = notices.reduce((total, item) => total + item.students.length, 0);
  const birthdays = getUpcomingBirthdays();
  return (
    <div className="admin-shell">
      <SideNav view="admin" setView={onBack} open={false} variant="direcao" userName="Marina Albuquerque" userEmail="marina@cepi.com" />
      <div className="admin-main">
        <Header onMenu={() => {}} />
        <div className="admin-content">
          <div className="admin-title">
            <div>
              <h1>Olá, diretora Marina 👋</h1>
              <p>Direção e Coordenação · resumo do portal hoje.</p>
            </div>
            <div className="admin-title-actions">
              <a className="outline-button" href="/direcao/perfil">
                <Settings size={15} /> Meu perfil
              </a>
              <button className="outline-button" onClick={onBack}>
                Sair
              </button>
            </div>
          </div>
          <SocialCta role="direcao" />
          <div className="stats">
            <div>
              <Users size={18} />
              <b>{students.length}</b>
              <span>Alunos</span>
            </div>
            <div>
              <Users size={18} />
              <b>{guardians.length}</b>
              <span>Responsáveis</span>
            </div>
            <div>
              <BookOpen size={18} />
              <b>{staff.length}</b>
              <span>Professores</span>
            </div>
          </div>
          <div className="admin-card">
            <div className="card-title">
              <span>♨</span> Aniversariantes da semana
            </div>
            {birthdays.length === 0 ? (
              <div className="empty">
                Nenhum aniversariante nos próximos 7 dias.
              </div>
            ) : (
              <div style={{ padding: "6px 0", fontSize: 13 }}>{birthdays.map((item) => item.name).join(", ")}</div>
            )}
          </div>
          <div className="admin-card">
            <div className="card-title quick-title">ACESSO RÁPIDO</div>
            <div className="admin-links">
              <a href="/direcao/rede-social/feed">
                <MessageCircle size={16} /> Rede Social Escolar
              </a>
              {adminLinks.map(([item, href]) => (
                <a key={item} href={href}>
                  <Settings size={16} />
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
