"use client";

import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { BoardNote, NoteKind } from "@/data/shared/rede-social";
import type { SocialRole } from "@/data/shared/social";
import { Modal, PageHead, Pills } from "@/components/rede-social/ui";

const typeFilters = ["Todas", "Atividades", "Provas", "Avisos"] as const;
const doneFilters = ["Todas", "Pendentes", "Concluídas"] as const;
const kindOf: Record<string, NoteKind> = { Atividades: "atividade", Provas: "prova", Avisos: "aviso" };
const kindLabel: Record<NoteKind, string> = { atividade: "Atividade", prova: "Prova", aviso: "Aviso" };

export function MuraisBoard({
  role,
  notes,
  setNotes,
}: {
  role: SocialRole;
  notes: BoardNote[];
  setNotes: Dispatch<SetStateAction<BoardNote[]>>;
}) {
  const isStudent = role === "aluno";
  const canPublish = role === "funcionario" || role === "coordenacao";
  const [filter, setFilter] = useState<string>("Todas");
  const [editing, setEditing] = useState<BoardNote | "new" | null>(null);

  const visible = notes.filter((note) => {
    if (note.hidden && !canPublish) return false;
    if (isStudent) {
      if (filter === "Pendentes") return !note.done;
      if (filter === "Concluídas") return note.done;
      return true;
    }
    return filter === "Todas" || note.kind === kindOf[filter];
  });
  const pending = notes.filter((note) => !note.done && !note.hidden).length;

  const title = role === "responsavel" ? "Murais de Aluno Modelo 101" : "Murais";
  const subtitle = isStudent
    ? `Atividades e prazos da sua turma · ${pending} pendentes`
    : role === "responsavel"
      ? "8º ano A · somente leitura · Visão do responsável"
      : canPublish
        ? "Gerencie atividades e prazos"
        : undefined;

  return (
    <>
      <PageHead
        title={title}
        subtitle={subtitle}
        action={
          canPublish ? (
            <button type="button" className="rs-primary" onClick={() => setEditing("new")}>
              + Nova publicação
            </button>
          ) : undefined
        }
      />
      <Pills options={isStudent ? doneFilters : typeFilters} value={filter as never} onChange={setFilter as never} ariaLabel="Filtrar murais" />
      {visible.length === 0 ? (
        <p className="rs-empty">Nenhuma publicação neste filtro.</p>
      ) : (
        <div className="rs-notes">
          {visible.map((note, index) => (
            <article className={`rs-note ${note.done ? "done" : ""} ${note.hidden ? "hidden" : ""}`} key={note.id} style={{ transform: `rotate(${index % 3 === 0 ? -1 : index % 3 === 1 ? 0.6 : -0.4}deg)` }}>
              <i className="rs-pin" />
              <h3>{note.subject}</h3>
              <small>{kindLabel[note.kind]}</small>
              <p>Data final: {note.due}</p>
              <p>{note.detail}</p>
              {isStudent && (
                <button type="button" className="rs-note-btn" onClick={() => setNotes((current) => current.map((item) => (item.id === note.id ? { ...item, done: !item.done } : item)))}>
                  {note.done ? "✓ Concluída (desfazer)" : "Marcar como concluída"}
                </button>
              )}
              {role === "funcionario" && (
                <div className="rs-note-actions">
                  <button type="button" onClick={() => setEditing(note)}>Editar</button>
                  <button type="button" onClick={() => setNotes((current) => current.map((item) => (item.id === note.id ? { ...item, hidden: !item.hidden } : item)))}>
                    {note.hidden ? "Mostrar" : "Ocultar"}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      {editing && <NoteModal note={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSave={(saved) => {
        setNotes((current) => editing === "new" ? [saved, ...current] : current.map((item) => (item.id === saved.id ? saved : item)));
        setEditing(null);
      }} />}
    </>
  );
}

function NoteModal({ note, onClose, onSave }: { note: BoardNote | null; onClose: () => void; onSave: (note: BoardNote) => void }) {
  const [scope, setScope] = useState("admins");
  const [subject, setSubject] = useState(note?.subject ?? "");
  const [detail, setDetail] = useState(note?.detail ?? "");
  const [due, setDue] = useState(note?.due ?? "");
  const [kind, setKind] = useState<NoteKind>(note?.kind ?? "atividade");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (subject.trim().length < 3) return setError("Informe um título com pelo menos 3 caracteres.");
    if (due && !/^\d{2}\/\d{2}$/.test(due.trim())) return setError("Use a data no formato dd/mm.");
    onSave({
      id: note?.id ?? Date.now(),
      subject: subject.trim(),
      detail: detail.trim() || "Sem descrição",
      due: due.trim() || "a definir",
      kind,
      done: note?.done ?? false,
      hidden: note?.hidden ?? false,
    });
  };

  return (
    <Modal title={note ? "Editar publicação" : "Nova publicação"} onClose={onClose}>
      <form className="rs-form" onSubmit={submit} noValidate>
        <label>Tipo de publicação</label>
        <div className="rs-radios">
          <label><input type="radio" name="scope" checked={scope === "admins"} onChange={() => setScope("admins")} /> Somente administradores</label>
          <label><input type="radio" name="scope" checked={scope === "public"} onChange={() => setScope("public")} /> Público</label>
        </div>
        <label htmlFor="note-title">Título</label>
        <input id="note-title" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Ex.: Introdução à Matemática, página 54" />
        <label htmlFor="note-kind">Categoria</label>
        <select id="note-kind" value={kind} onChange={(event) => setKind(event.target.value as NoteKind)}>
          <option value="atividade">Atividade</option>
          <option value="prova">Prova</option>
          <option value="aviso">Aviso</option>
        </select>
        <label htmlFor="note-due">Data final (dd/mm)</label>
        <input id="note-due" value={due} onChange={(event) => setDue(event.target.value)} placeholder="30/11" />
        <label htmlFor="note-desc">Descrição da publicação (opcional)</label>
        <textarea id="note-desc" value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="Digite uma descrição…" />
        {error && <p className="rs-error">{error}</p>}
        <button type="submit" className="rs-primary center">Publicar</button>
      </form>
    </Modal>
  );
}
