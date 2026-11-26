"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ZxPage } from "@/components/shared/zx-page";
import { useDemoGuard } from "@/lib/demo-session";
import {
  getClass,
  getClassesOfStaff,
  getRegistrationNotices,
  getStudent,
  guardians,
  permissionMatrix,
  staff,
  students,
} from "@/data/shared/school";

const tabs = [
  ["alunos", "Alunos"],
  ["responsaveis", "Responsáveis"],
  ["equipe", "Equipe"],
  ["vinculos", "Vínculos"],
  ["avisos", "Avisos de cadastro"],
  ["permissoes", "Permissões"],
  ["logs", "Logs de acesso"],
  ["backup", "Backup e segurança"],
] as const;

export default function CadastrosPage() {
  const { role, section } = useParams<{ role: string; section: string }>();
  const authorized = useDemoGuard(role, ["admin"]);
  const [search, setSearch] = useState("");
  const [backupMsg, setBackupMsg] = useState("");

  if (!authorized) return null;

  const current = tabs.find(([key]) => key === section) ?? tabs[0];
  const term = search.trim().toLowerCase();
  const match = (...values: string[]) => values.some((value) => value.toLowerCase().includes(term));

  let body: React.ReactNode;

  if (current[0] === "alunos") {
    const rows = students.filter((item) => match(item.name, item.ra, getClass(item.classId)?.name ?? ""));
    body = (
      <Table
        head={["ALUNO", "RA", "TURMA", "RESPONSÁVEL"]}
        rows={rows.map((item) => [
          item.name,
          item.ra,
          getClass(item.classId)?.name ?? "-",
          item.guardianIds.length > 0 ? (
            guardians
              .filter((guardian) => item.guardianIds.includes(guardian.id))
              .map((guardian) => guardian.name)
              .join(", ")
          ) : (
            <span className="zx-pill warn" key="none">
              Sem responsável
            </span>
          ),
        ])}
      />
    );
  } else if (current[0] === "responsaveis") {
    const rows = guardians.filter((item) => match(item.name, item.email));
    body = (
      <Table
        head={["RESPONSÁVEL", "E-MAIL", "TELEFONE", "ALUNOS VINCULADOS"]}
        rows={rows.map((item) => [
          item.name,
          item.email,
          item.phone,
          Object.entries(item.relationships)
            .map(([studentId, relation]) => `${getStudent(Number(studentId))?.name} (${relation})`)
            .join(", "),
        ])}
      />
    );
  } else if (current[0] === "equipe") {
    const rows = staff.filter((item) => match(item.name, item.subject, item.position));
    body = (
      <Table
        head={["PROFISSIONAL", "CARGO", "DISCIPLINA / ÁREA", "TURMAS"]}
        rows={rows.map((item) => [
          item.name,
          item.position,
          item.subject,
          getClassesOfStaff(item.id)
            .map((schoolClass) => schoolClass.name)
            .join(", "),
        ])}
      />
    );
  } else if (current[0] === "vinculos") {
    const rows = students.filter((item) => match(item.name, getClass(item.classId)?.name ?? ""));
    body = (
      <>
        <p className="zx-notice">
          Relação entre alunos, turmas, professores e responsáveis. Um responsável só enxerga os alunos vinculados a ele.
        </p>
        <Table
          head={["ALUNO", "TURMA", "PROFESSORES DA TURMA", "RESPONSÁVEL (PARENTESCO)"]}
          rows={rows.map((item) => {
            const schoolClass = getClass(item.classId);
            return [
              item.name,
              schoolClass?.name ?? "-",
              staff
                .filter((person) => schoolClass?.teacherIds.includes(person.id))
                .map((person) => person.name)
                .join(", "),
              guardians
                .filter((guardian) => item.guardianIds.includes(guardian.id))
                .map((guardian) => `${guardian.name} (${guardian.relationships[item.id]})`)
                .join(", ") || "-",
            ];
          })}
        />
      </>
    );
  } else if (current[0] === "avisos") {
    body = (
      <div style={{ display: "grid", gap: 14 }}>
        {getRegistrationNotices().map((notice) => (
          <div key={notice.title} className="zx-card">
            <b>
              {notice.title} <span className="zx-pill warn">{notice.students.length}</span>
            </b>
            <small>{notice.description}</small>
            <div style={{ marginTop: 8, fontSize: 13 }}>
              {notice.students.length > 0 ? notice.students.map((item) => item.name).join(", ") : "Nenhuma pendência."}
            </div>
          </div>
        ))}
      </div>
    );
  } else if (current[0] === "logs") {
    body = (
      <Table
        head={["DATA", "USUÁRIO", "PERFIL", "AÇÃO"]}
        rows={[
          ["25/11 08:12", "rafael@cepi.com", "Aluno", "Login realizado"],
          ["25/11 08:05", "fernanda@cepi.com", "Docência", "Lançou notas do 1º bimestre"],
          ["25/11 07:58", "marina@cepi.com", "Direção", "Publicou comunicado"],
          ["25/11 07:40", "fabricya@cepi.com", "Responsável", "Login realizado"],
          ["24/11 18:22", "admin@cepi.com", "Administração", "Alterou permissões"],
        ]}
      />
    );
  } else if (current[0] === "backup") {
    body = (
      <div className="zx-card" style={{ display: "grid", gap: 10 }}>
        <b>Backup e segurança (demonstração)</b>
        <small>Último backup simulado: hoje, 03:00 · Autenticação em duas etapas: desativada · Sessões ativas: 4</small>
        <button
          type="button"
          className="rs-primary"
          onClick={() => setBackupMsg(`Backup gerado às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} (nenhum arquivo é criado na demonstração).`)}
        >
          Gerar backup agora
        </button>
        {backupMsg && <p className="rs-note-msg" role="status">{backupMsg}</p>}
      </div>
    );
  } else {
    body = (
      <>
        <p className="zx-notice">
          Níveis de acesso simulados de cada perfil. Em produção estas regras seriam aplicadas pelo servidor.
        </p>
        <Table
          head={["RECURSO", "ALUNO", "RESPONSÁVEL", "DOCÊNCIA", "DIREÇÃO / TI"]}
          rows={permissionMatrix.map((row) => [row.resource, row.aluno, row.responsavel, row.funcionario, row.admin])}
        />
      </>
    );
  }

  const searchable = ["alunos", "responsaveis", "equipe", "vinculos"].includes(current[0]);

  return (
    <ZxPage
      role={role}
      eyebrow="ADMINISTRAÇÃO · TI"
      title="Cadastros e acessos"
      subtitle="Controle de pessoas, acessos, logs e segurança do sistema."
    >
      <div className="zx-tabs">
        {tabs.map(([key, label]) => (
          <Link key={key} href={`/${role}/cadastros/${key}`} className={current[0] === key ? "active" : ""} onClick={() => setSearch("")}>
            {label}
          </Link>
        ))}
      </div>
      {searchable && (
        <input
          className="zx-search"
          placeholder="Buscar"
          aria-label="Buscar"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      )}
      {body}
    </ZxPage>
  );
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  if (rows.length === 0) return <div className="zx-empty">Nenhum registro encontrado.</div>;
  return (
    <div className="zx-table-wrap">
      <table className="zx-table">
        <thead>
          <tr>
            {head.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
