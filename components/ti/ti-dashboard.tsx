"use client";

import { ChevronDown, KeyRound, ScrollText, Settings, ShieldAlert, Users } from "lucide-react";
import { Header, SideNav } from "@/components/shared/platform-shell";
import { getRegistrationNotices, guardians, staff, students } from "@/data/shared/school";

const links: [string, string][] = [
  ["Alunos", "/admin/cadastros/alunos"],
  ["Responsáveis", "/admin/cadastros/responsaveis"],
  ["Equipe", "/admin/cadastros/equipe"],
  ["Vínculos", "/admin/cadastros/vinculos"],
  ["Permissões de acesso", "/admin/cadastros/permissoes"],
  ["Logs de acesso", "/admin/cadastros/logs"],
  ["Backup e segurança", "/admin/cadastros/backup"],
  ["Meu perfil", "/admin/perfil"],
];

export function TiDashboard({ onBack }: { onBack: () => void }) {
  const notices = getRegistrationNotices();
  const totalNotices = notices.reduce((total, item) => total + item.students.length, 0);
  return (
    <div className="admin-shell">
      <SideNav view="admin" setView={onBack} open={false} variant="ti" userName="Administrador TI" userEmail="admin@cepi.com" />
      <div className="admin-main">
        <Header onMenu={() => {}} initials="TI" />
        <div className="admin-content">
          <div className="admin-title">
            <div>
              <h1>Olá, administrador 👋</h1>
              <p>Administração · controle de pessoas, acessos e segurança do sistema.</p>
            </div>
            <div className="admin-title-actions">
              <a className="outline-button" href="/admin/perfil">
                <Settings size={15} /> Meu perfil
              </a>
              <button className="outline-button" onClick={onBack}>
                Sair
              </button>
            </div>
          </div>
          <div className="stats">
            <div>
              <Users size={18} />
              <b>{students.length + guardians.length + staff.length + 2}</b>
              <span>Usuários ativos</span>
            </div>
            <div>
              <KeyRound size={18} />
              <b>5</b>
              <span>Perfis de acesso</span>
            </div>
            <div>
              <ScrollText size={18} />
              <b>38</b>
              <span>Acessos hoje</span>
            </div>
          </div>
          <div className="admin-card notices">
            <div className="card-title">
              <ShieldAlert size={15} /> Avisos de cadastro <mark>{totalNotices}</mark>
            </div>
            {notices.map(({ title, description, students: affected }) => (
              <a className="notice" key={title} href="/admin/cadastros/avisos" style={{ textDecoration: "none", color: "inherit" }}>
                <ShieldAlert size={17} />
                <div>
                  <b>{title}</b>
                  <small>{description}</small>
                </div>
                <mark>{affected.length}</mark>
                <ChevronDown size={14} />
              </a>
            ))}
          </div>
          <div className="admin-card">
            <div className="card-title quick-title">ACESSO RÁPIDO</div>
            <div className="admin-links">
              {links.map(([item, href]) => (
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
