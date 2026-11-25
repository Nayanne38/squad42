"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ZxPage } from "@/components/shared/zx-page";
import { useDemoGuard } from "@/lib/demo-session";
import {
  CURRENT_STAFF_ID,
  getClassesOfStaff,
  getGuardiansOfStudent,
  getStudentsOfClass,
  schoolClasses,
  staff,
} from "@/data/shared/school";

export default function TurmasPage() {
  const { role } = useParams<{ role: string }>();
  const authorized = useDemoGuard(role, ["funcionario", "admin"]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  if (!authorized) return null;

  // O professor vê apenas as turmas que leciona; o administrador vê todas.
  const classes = role === "admin" ? schoolClasses : getClassesOfStaff(CURRENT_STAFF_ID);
  const selected = classes.find((item) => item.id === selectedId) ?? null;
  const roster = selected
    ? getStudentsOfClass(selected.id).filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <ZxPage
      role={role}
      eyebrow="ÁREA DO PROFESSOR"
      title={role === "admin" ? "Turmas" : "Minhas turmas"}
      subtitle="Acompanhe as turmas, os alunos e os responsáveis vinculados."
    >
      {!selected ? (
        <>
          <h2>Turmas ({classes.length})</h2>
          <p className="zx-muted">Selecione uma turma para ver os alunos.</p>
          <div className="zx-grid">
            {classes.map((item) => (
              <button
                key={item.id}
                className="zx-card"
                onClick={() => {
                  setSelectedId(item.id);
                  setSearch("");
                }}
              >
                <b>{item.name}</b>
                <small>
                  {item.level} · {item.room}
                </small>
                <div style={{ marginTop: 8 }}>
                  <span className="zx-pill">{getStudentsOfClass(item.id).length} alunos</span>
                </div>
                <small style={{ display: "block", marginTop: 8 }}>
                  Professores:{" "}
                  {staff
                    .filter((person) => item.teacherIds.includes(person.id))
                    .map((person) => person.name.split(" ")[0])
                    .join(", ")}
                </small>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="zx-tabs">
            <button onClick={() => setSelectedId(null)}>← Todas as turmas</button>
          </div>
          <h2>
            {selected.name} <span className="zx-pill">{getStudentsOfClass(selected.id).length} alunos</span>
          </h2>
          <p className="zx-muted">
            {selected.level} · {selected.room}
          </p>
          <input
            className="zx-search"
            placeholder="Buscar aluno"
            aria-label="Buscar aluno"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {roster.length === 0 ? (
            <div className="zx-empty">Nenhum aluno encontrado.</div>
          ) : (
            <div className="zx-table-wrap">
              <table className="zx-table">
                <thead>
                  <tr>
                    <th>ALUNO</th>
                    <th>RA</th>
                    <th>RESPONSÁVEL</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((student) => {
                    const linked = getGuardiansOfStudent(student.id);
                    return (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.ra}</td>
                        <td>
                          {linked.length > 0 ? (
                            linked.map((guardian) => `${guardian.name} (${guardian.relationships[student.id]})`).join(", ")
                          ) : (
                            <span className="zx-pill warn">Sem responsável</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </ZxPage>
  );
}
