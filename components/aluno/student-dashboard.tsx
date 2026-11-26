"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { SocialCta } from "@/components/shared/social-cta";
import {
  CURRENT_GUARDIAN_ID,
  SELECTED_STUDENT_KEY,
  getClass,
  getStudentsOfGuardian,
  initialsOf,
  resolveStudentForRole,
} from "@/data/shared/school";

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
  const routeRole = isParent ? "responsavel" : "aluno";
  const linkedStudents = isParent ? getStudentsOfGuardian(CURRENT_GUARDIAN_ID) : [];
  const [selectedId, setSelectedId] = useState<number>(resolveStudentForRole(routeRole, null).id);
  const selected = resolveStudentForRole(routeRole, String(selectedId));

  useEffect(() => {
    if (!isParent) return;
    try {
      setSelectedId(resolveStudentForRole(routeRole, sessionStorage.getItem(SELECTED_STUDENT_KEY)).id);
    } catch {
      /* mantém o primeiro aluno vinculado */
    }
  }, [isParent, routeRole]);

  function selectStudent(id: number) {
    setSelectedId(id);
    try {
      sessionStorage.setItem(SELECTED_STUDENT_KEY, String(id));
    } catch {
      /* ignora */
    }
  }

  return (
    <div className="portal">
      <div className="portal-head">
        <Brand compact />
        <div className="portal-profile">
          <span>{isParent ? "FN" : "RM"}</span>
          <ChevronDown size={14} />
        </div>
      </div>
      {isParent ? (
        <>
          <div className="welcome blue-bg">
            <div className="big-avatar">FN</div>
            <div>
              <small>Portal do Responsável</small>
              <h2>Olá, Fabricya!</h2>
              <p>
                {linkedStudents.length} {linkedStudents.length === 1 ? "aluno vinculado" : "alunos vinculados"}
              </p>
            </div>
          </div>
          <label className="eyebrow">SELECIONE O ALUNO</label>
          {linkedStudents.map((student) => (
            <button
              key={student.id}
              className="student-select"
              aria-pressed={student.id === selected.id}
              style={student.id === selected.id ? { borderColor: "#1b8a45", boxShadow: "0 0 0 3px #e3f4ea" } : undefined}
              onClick={() => selectStudent(student.id)}
            >
              <div className="big-avatar small">{initialsOf(student.name)}</div>
              <b>
                {student.name}
                <br />
                <small>
                  RA {student.ra} · {getClass(student.classId)?.name}
                </small>
              </b>
              <span>{student.guardianIds.includes(CURRENT_GUARDIAN_ID) ? "Vinculado" : ""}</span>
            </button>
          ))}
        </>
      ) : (
        <div className="welcome green-bg">
          <div className="big-avatar">R</div>
          <div>
            <small>Bem-vindo de volta</small>
            <h2>Rafael da Silva Moura</h2>
            <p>
              RA: <b>20260011</b>
            </p>
          </div>
        </div>
      )}
      <SocialCta role={routeRole} />
      <div className="portal-card">
        {isParent ? (
          <div className="student-row">
            <div className="big-avatar small">{initialsOf(selected.name)}</div>
            <div>
              <b>{selected.name}</b>
              <small>RA: {selected.ra}</small>
              <span>
                {getClass(selected.classId)?.name}　 Mãe
              </span>
            </div>
          </div>
        ) : (
          <div className="card-title">
            <Megaphone size={16} /> Comunicados recentes
            <Link href={`/${routeRole}/comunicados`}>
              Ver todos →
            </Link>
          </div>
        )}
        <div className="card-title quick-title">ACESSO RÁPIDO</div>
        <div className="quick-grid">
            {quickItems.map(([name, description, Icon, color]) => {
              const content = (
                <>
                  <div className={`quick-icon ${color}`}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <b>{name}</b>
                    <small>{description}</small>
                  </div>
                  <ChevronRight size={15} />
                </>
              );

              if (name === "Agenda de aulas") {
                return (
                  <Link key={name} href={`/${routeRole}/agenda`} className="quick-item">
                    {content}
                  </Link>
                );
              }

              if (name === "Calendário") {
                return (
                  <Link key={name} href={`/${routeRole}/calendario`} className="quick-item">
                    {content}
                  </Link>
                );
              }

              if (name === "Horários") {
                return (
                  <Link key={name} href={`/${routeRole}/horarios`} className="quick-item">
                    {content}
                  </Link>
                );
              }

              if (name === "Comunicados" || name === "Perfil") {
                return (
                  <Link key={name} href={`/${routeRole}/${name === "Perfil" ? "perfil" : "comunicados"}`} className="quick-item">
                    {content}
                  </Link>
                );
              }

              if (name === "Notas") {
                return (
                  <Link key={name} href={`/${routeRole}/notas`} className="quick-item">
                    {content}
                  </Link>
                );
              }
              return (
                <button key={name} className="quick-item">
                  {content}
                </button>
              );
            })}
        </div>
      </div>
      <button className="back-button" onClick={onBack}>
        Sair
      </button>
      <footer className="portal-footer">Desenvolvido por ZenixCode</footer>
    </div>
  );
}
