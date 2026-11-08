"use client";

import {
  BookOpen,
  ChevronDown,
  MessageCircle,
  Settings,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Header, SideNav } from "@/components/shared/platform-shell";

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  return (
    <div className="admin-shell">
      <SideNav view="admin" setView={onBack} open={false} />
      <div className="admin-main">
        <Header onMenu={() => {}} />
        <div className="admin-content">
          <div className="admin-title">
            <div>
              <h1>Olá, Administrador 👋</h1>
              <p>Aqui está um resumo do portal hoje.</p>
            </div>
            <div className="admin-title-actions">
              <button className="outline-button">
                <Settings size={15} /> Personalizar
              </button>
              <button className="outline-button" onClick={onBack}>
                Sair
              </button>
            </div>
          </div>
          <div className="stats">
            <div>
              <Users size={18} />
              <b>11</b>
              <span>Alunos</span>
            </div>
            <div>
              <Users size={18} />
              <b>3</b>
              <span>Responsáveis</span>
            </div>
            <div>
              <BookOpen size={18} />
              <b>4</b>
              <span>Profissionais</span>
            </div>
          </div>
          <div className="admin-card">
            <div className="card-title">
              <span>♨</span> Aniversariantes da semana
            </div>
            <div className="empty">
              Nenhum aniversariante nos próximos 7 dias.
            </div>
          </div>
          <div className="admin-card notices">
            <div className="card-title">
              <ShieldAlert size={15} /> Avisos de cadastro <mark>32</mark>
            </div>
            {[
              [
                "Alunos sem responsável financeiro",
                "Alunos ativos que não têm responsável financeiro cadastrado.",
                "11",
              ],
              [
                "Alunos sem data de nascimento",
                "Alunos ativos cujo cadastro não tem data de nascimento.",
                "10",
              ],
              ["Alunos sem foto", "Alunos ativos sem foto no cadastro.", "11"],
            ].map(([title, description, count]) => (
              <div className="notice" key={title}>
                <ShieldAlert size={17} />
                <div>
                  <b>{title}</b>
                  <small>{description}</small>
                </div>
                <mark>{count}</mark>
                <ChevronDown size={14} />
              </div>
            ))}
          </div>
          <div className="admin-card">
            <div className="card-title quick-title">ACESSO RÁPIDO</div>
            <div className="admin-links">
              <a href="/funcionario/rede-social/feed">
                <MessageCircle size={16} /> Rede Social Escolar
              </a>
              {[
                "Gerenciar alunos",
                "Gerenciar turmas",
                "Enviar mensagem",
                "Mensagens em massa",
                "Equipe",
                "Configurações",
              ].map((item) => (
                <button key={item}>
                  <Settings size={16} />
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
