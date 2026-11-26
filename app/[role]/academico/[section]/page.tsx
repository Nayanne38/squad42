"use client";

import { useEffect, useState, type FormEvent } from "react";
import { notFound, useParams } from "next/navigation";
import { ZxPage } from "@/components/shared/zx-page";
import { useDemoGuard } from "@/lib/demo-session";
import {
  CURRENT_STAFF_ID,
  getClassesOfStaff,
  getStudentsOfClass,
  schoolClasses,
  staffLessonsToday,
  students,
} from "@/data/shared/school";

type Row = Record<string, string>;
type Field = { key: string; label: string; placeholder?: string; options?: string[]; textarea?: boolean };
type ListConfig = {
  title: string;
  subtitle: string;
  adminOnly?: boolean;
  columns: { key: string; label: string }[];
  fields: Field[];
  seed: Row[];
  addLabel: string;
};

const studentNames = students.map((item) => item.name);
const today = () => new Date().toLocaleDateString("pt-BR");

const lists: Record<string, ListConfig> = {
  ocorrencias: {
    title: "Ocorrências",
    subtitle: "Registros disciplinares e pedagógicos dos alunos.",
    columns: [{ key: "data", label: "DATA" }, { key: "aluno", label: "ALUNO" }, { key: "tipo", label: "TIPO" }, { key: "descricao", label: "DESCRIÇÃO" }],
    fields: [
      { key: "aluno", label: "Aluno", options: studentNames },
      { key: "tipo", label: "Tipo", options: ["Elogio", "Advertência", "Atraso", "Falta de material", "Outro"] },
      { key: "descricao", label: "Descrição", placeholder: "Descreva o ocorrido", textarea: true },
    ],
    seed: [
      { data: "21/11/2026", aluno: "Atabisio Henry", tipo: "Elogio", descricao: "Ajudou colegas na revisão de Matemática." },
      { data: "18/11/2026", aluno: "João Vitor Braz Mourão", tipo: "Atraso", descricao: "Chegou 15 minutos após o início da aula." },
    ],
    addLabel: "Registrar ocorrência",
  },
  reforco: {
    title: "Reforço / Extras",
    subtitle: "Aulas de reforço e atividades extras por turma.",
    columns: [{ key: "turma", label: "TURMA" }, { key: "tema", label: "TEMA" }, { key: "dia", label: "DIA" }, { key: "horario", label: "HORÁRIO" }],
    fields: [
      { key: "turma", label: "Turma", options: schoolClasses.map((item) => item.name) },
      { key: "tema", label: "Tema", placeholder: "Ex.: Revisão de frações" },
      { key: "dia", label: "Dia da semana", options: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"] },
      { key: "horario", label: "Horário", placeholder: "14:00 - 15:00" },
    ],
    seed: [
      { turma: "8º Ano A", tema: "Revisão de Função Quadrática", dia: "Quarta", horario: "14:00 - 15:00" },
      { turma: "7º Ano B", tema: "Oficina de Redação", dia: "Sexta", horario: "13:30 - 14:30" },
    ],
    addLabel: "Agendar reforço",
  },
  "banco-questoes": {
    title: "Banco de Questões",
    subtitle: "Questões cadastradas por disciplina e nível.",
    adminOnly: true,
    columns: [{ key: "disciplina", label: "DISCIPLINA" }, { key: "enunciado", label: "ENUNCIADO" }, { key: "nivel", label: "NÍVEL" }],
    fields: [
      { key: "disciplina", label: "Disciplina", options: ["Matemática", "Português", "Ciências", "Geografia", "História", "Inglês"] },
      { key: "enunciado", label: "Enunciado", placeholder: "Digite a questão", textarea: true },
      { key: "nivel", label: "Nível", options: ["Fácil", "Médio", "Difícil"] },
    ],
    seed: [
      { disciplina: "Matemática", enunciado: "Calcule as raízes de x² − 5x + 6 = 0.", nivel: "Fácil" },
      { disciplina: "Ciências", enunciado: "Descreva as etapas do ciclo da água.", nivel: "Médio" },
    ],
    addLabel: "Adicionar questão",
  },
  simulados: {
    title: "Simulados",
    subtitle: "Simulados programados para as turmas.",
    adminOnly: true,
    columns: [{ key: "nome", label: "SIMULADO" }, { key: "turma", label: "TURMA" }, { key: "data", label: "DATA" }, { key: "status", label: "STATUS" }],
    fields: [
      { key: "nome", label: "Nome", placeholder: "Ex.: Simulado 4º bimestre" },
      { key: "turma", label: "Turma", options: schoolClasses.map((item) => item.name) },
      { key: "data", label: "Data", placeholder: "08/12/2026" },
    ],
    seed: [{ nome: "Simulado 4º bimestre", turma: "9º Ano A", data: "08/12/2026", status: "Agendado" }],
    addLabel: "Agendar simulado",
  },
  provas: {
    title: "Provas",
    subtitle: "Calendário de provas por turma.",
    adminOnly: true,
    columns: [{ key: "disciplina", label: "DISCIPLINA" }, { key: "turma", label: "TURMA" }, { key: "data", label: "DATA" }, { key: "status", label: "STATUS" }],
    fields: [
      { key: "disciplina", label: "Disciplina", options: ["Matemática", "Português", "Ciências", "Geografia", "História", "Inglês"] },
      { key: "turma", label: "Turma", options: schoolClasses.map((item) => item.name) },
      { key: "data", label: "Data", placeholder: "10/12/2026" },
    ],
    seed: [
      { disciplina: "Matemática", turma: "8º Ano A", data: "01/12/2026", status: "Agendada" },
      { disciplina: "Português", turma: "8º Ano A", data: "03/12/2026", status: "Agendada" },
    ],
    addLabel: "Agendar prova",
  },
  visitantes: {
    title: "Visitantes",
    subtitle: "Registro de entrada de visitantes na escola.",
    adminOnly: true,
    columns: [{ key: "nome", label: "VISITANTE" }, { key: "motivo", label: "MOTIVO" }, { key: "hora", label: "ENTRADA" }],
    fields: [
      { key: "nome", label: "Nome", placeholder: "Nome do visitante" },
      { key: "motivo", label: "Motivo", placeholder: "Ex.: Reunião com a coordenação" },
    ],
    seed: [{ nome: "Helena Souza", motivo: "Reunião com a coordenação", hora: "08:20" }],
    addLabel: "Registrar entrada",
  },
  saidas: {
    title: "Autorizações de saída",
    subtitle: "Saídas antecipadas autorizadas pelos responsáveis.",
    adminOnly: true,
    columns: [{ key: "aluno", label: "ALUNO" }, { key: "motivo", label: "MOTIVO" }, { key: "hora", label: "HORÁRIO" }],
    fields: [
      { key: "aluno", label: "Aluno", options: studentNames },
      { key: "motivo", label: "Motivo", placeholder: "Ex.: Consulta médica" },
      { key: "hora", label: "Horário de saída", placeholder: "11:30" },
    ],
    seed: [{ aluno: "João Vitor Braz Mourão", motivo: "Consulta médica", hora: "11:30" }],
    addLabel: "Autorizar saída",
  },
  historico: {
    title: "Histórico de acesso",
    subtitle: "Entradas e saídas registradas na portaria.",
    adminOnly: true,
    columns: [{ key: "pessoa", label: "PESSOA" }, { key: "tipo", label: "TIPO" }, { key: "hora", label: "HORÁRIO" }],
    fields: [
      { key: "pessoa", label: "Pessoa", placeholder: "Nome" },
      { key: "tipo", label: "Tipo", options: ["Entrada", "Saída"] },
    ],
    seed: [
      { pessoa: "Atabisio Henry", tipo: "Entrada", hora: "07:02" },
      { pessoa: "Rafael da Silva Moura", tipo: "Entrada", hora: "07:05" },
      { pessoa: "Fernanda Lima", tipo: "Entrada", hora: "06:50" },
    ],
    addLabel: "Registrar acesso",
  },
  painel: {
    title: "Painel ao vivo",
    subtitle: "Movimentação da portaria em tempo real (demonstração).",
    adminOnly: true,
    columns: [{ key: "pessoa", label: "PESSOA" }, { key: "tipo", label: "TIPO" }, { key: "hora", label: "HORÁRIO" }],
    fields: [
      { key: "pessoa", label: "Pessoa", placeholder: "Nome" },
      { key: "tipo", label: "Tipo", options: ["Entrada", "Saída"] },
    ],
    seed: [
      { pessoa: "Helena Souza", tipo: "Entrada", hora: "08:20" },
      { pessoa: "Carlos Pedro", tipo: "Saída", hora: "09:10" },
    ],
    addLabel: "Registrar movimentação",
  },
};

const eyebrowOf = (role: string) => (role === "direcao" ? "ÁREA DA DIREÇÃO / COORDENAÇÃO" : "ÁREA DO PROFESSOR");

function useStored<T>(key: string, seed: T) {
  const [value, setValue] = useState<T>(seed);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* usa os dados de exemplo */
    }
    setReady(true);
  }, [key]);
  const update = (next: T) => {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignora */
    }
  };
  return [value, update, ready] as const;
}

function ListSection({ id, config, role }: { id: string; config: ListConfig; role: string }) {
  const [rows, setRows] = useStored<Row[]>(`zenix-academico-${id}`, config.seed);
  const [form, setForm] = useState<Row>({});
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values: Row = {};
    for (const field of config.fields) {
      const value = (form[field.key] ?? field.options?.[0] ?? "").trim();
      if (!value) return setError(`Preencha o campo "${field.label}".`);
      values[field.key] = value;
    }
    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const extra: Row = {};
    if (config.columns.some((column) => column.key === "data") && !values.data) extra.data = today();
    if (config.columns.some((column) => column.key === "hora") && !values.hora) extra.hora = now;
    if (config.columns.some((column) => column.key === "status")) extra.status = "Agendado";
    setRows([{ ...extra, ...values }, ...rows]);
    setForm({});
    setError("");
    setSaved("Registro salvo.");
  };

  return (
    <ZxPage role={role} eyebrow={eyebrowOf(role)} title={config.title} subtitle={config.subtitle}>
      <form className="rs-form ac-form" onSubmit={submit} noValidate>
        <h2>{config.addLabel}</h2>
        <div className="ac-fields">
          {config.fields.map((field) => (
            <div key={field.key}>
              <label htmlFor={`${id}-${field.key}`}>{field.label}</label>
              {field.options ? (
                <select id={`${id}-${field.key}`} value={form[field.key] ?? field.options[0]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}>
                  {field.options.map((option) => <option key={option}>{option}</option>)}
                </select>
              ) : field.textarea ? (
                <textarea id={`${id}-${field.key}`} value={form[field.key] ?? ""} placeholder={field.placeholder} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} />
              ) : (
                <input id={`${id}-${field.key}`} value={form[field.key] ?? ""} placeholder={field.placeholder} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} />
              )}
            </div>
          ))}
        </div>
        {error && <p className="rs-error">{error}</p>}
        {saved && <p className="rs-note-msg" role="status">{saved}</p>}
        <button type="submit" className="rs-primary">{config.addLabel}</button>
      </form>
      <h2>Registros ({rows.length})</h2>
      <div className="ac-table-wrap">
        <table className="rs-table">
          <thead><tr>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>{config.columns.map((column) => <td key={column.key}>{row[column.key] ?? "-"}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </ZxPage>
  );
}

function GradesSection({ role }: { role: string }) {
  const classes = role === "direcao" ? schoolClasses : getClassesOfStaff(CURRENT_STAFF_ID);
  const [classId, setClassId] = useState(classes[0].id);
  const [term, setTerm] = useState("1º Bimestre");
  const [stored, setStored] = useStored<Record<string, string>>("zenix-academico-notas", {});
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const roster = getStudentsOfClass(classId);
  const keyOf = (studentId: number) => `${term}|${classId}|${studentId}`;

  const save = () => {
    const next = { ...stored };
    for (const student of roster) {
      const raw = (draft[keyOf(student.id)] ?? stored[keyOf(student.id)] ?? "").replace(",", ".").trim();
      if (!raw) continue;
      const value = Number(raw);
      if (Number.isNaN(value) || value < 0 || value > 10) return setError(`Nota inválida para ${student.name}: use valores de 0 a 10.`);
      next[keyOf(student.id)] = value.toFixed(1);
    }
    setError("");
    setStored(next);
    setDraft({});
    setSaved(`Notas do ${term} salvas.`);
  };

  return (
    <ZxPage role={role} eyebrow={eyebrowOf(role)} title="Lançamento de Notas" subtitle="Lance as notas por turma e bimestre.">
      <div className="ac-fields">
        <div>
          <label htmlFor="nt-class">Turma</label>
          <select id="nt-class" value={classId} onChange={(event) => { setClassId(Number(event.target.value)); setSaved(""); setError(""); }}>
            {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="nt-term">Bimestre</label>
          <select id="nt-term" value={term} onChange={(event) => { setTerm(event.target.value); setSaved(""); }}>
            {["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <div className="ac-table-wrap">
        <table className="rs-table">
          <thead><tr><th>ALUNO</th><th>NOTA (0 a 10)</th></tr></thead>
          <tbody>
            {roster.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>
                  <input className="ac-note" inputMode="decimal" aria-label={`Nota de ${student.name}`} value={draft[keyOf(student.id)] ?? stored[keyOf(student.id)] ?? ""} onChange={(event) => setDraft({ ...draft, [keyOf(student.id)]: event.target.value })} placeholder="--" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="rs-error">{error}</p>}
      {saved && <p className="rs-note-msg" role="status">{saved}</p>}
      <button type="button" className="rs-primary" onClick={save}>Salvar notas</button>
    </ZxPage>
  );
}

function DiarySection({ role }: { role: string }) {
  const classes = role === "direcao" ? schoolClasses : getClassesOfStaff(CURRENT_STAFF_ID);
  const [classId, setClassId] = useState(classes[0].id);
  const [content, setContent] = useState("");
  const [absent, setAbsent] = useState<number[]>([]);
  const [entries, setEntries] = useStored<Row[]>("zenix-academico-diario", [
    { data: "21/11/2026", turma: "8º Ano A", conteudo: "Função quadrática: vértice e raízes.", faltas: "1" },
  ]);
  const [error, setError] = useState("");
  const roster = getStudentsOfClass(classId);
  const className = classes.find((item) => item.id === classId)?.name ?? "";

  const save = () => {
    if (content.trim().length < 5) return setError("Descreva o conteúdo da aula (mínimo 5 caracteres).");
    setEntries([{ data: today(), turma: className, conteudo: content.trim(), faltas: String(absent.length) }, ...entries]);
    setContent("");
    setAbsent([]);
    setError("");
  };

  return (
    <ZxPage role={role} eyebrow={eyebrowOf(role)} title="Diário de Classe" subtitle="Registre o conteúdo da aula e a frequência dos alunos.">
      <div className="ac-fields">
        <div>
          <label htmlFor="dc-class">Turma</label>
          <select id="dc-class" value={classId} onChange={(event) => { setClassId(Number(event.target.value)); setAbsent([]); }}>
            {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
      </div>
      <label htmlFor="dc-content">Conteúdo da aula</label>
      <textarea id="dc-content" className="rs-textarea" value={content} onChange={(event) => setContent(event.target.value)} placeholder="O que foi trabalhado hoje?" />
      <h2>Faltas</h2>
      <div className="ac-checks">
        {roster.map((student) => (
          <label key={student.id}>
            <input type="checkbox" checked={absent.includes(student.id)} onChange={() => setAbsent((current) => current.includes(student.id) ? current.filter((id) => id !== student.id) : [...current, student.id])} /> {student.name}
          </label>
        ))}
      </div>
      {error && <p className="rs-error">{error}</p>}
      <button type="button" className="rs-primary" onClick={save}>Salvar registro</button>
      <h2>Registros anteriores</h2>
      <div className="ac-table-wrap">
        <table className="rs-table">
          <thead><tr><th>DATA</th><th>TURMA</th><th>CONTEÚDO</th><th>FALTAS</th></tr></thead>
          <tbody>
            {entries.map((entry, index) => <tr key={index}><td>{entry.data}</td><td>{entry.turma}</td><td>{entry.conteudo}</td><td>{entry.faltas}</td></tr>)}
          </tbody>
        </table>
      </div>
    </ZxPage>
  );
}

function ScheduleSection({ role }: { role: string }) {
  return (
    <ZxPage role={role} eyebrow={eyebrowOf(role)} title="Horários" subtitle="Aulas e atividades do dia.">
      <div className="ac-table-wrap">
        <table className="rs-table">
          <thead><tr><th>HORÁRIO</th><th>TURMA</th><th>ATIVIDADE</th><th>SALA</th></tr></thead>
          <tbody>
            {staffLessonsToday.map((lesson, index) => (
              <tr key={index}>
                {Object.values(lesson).map((value, cell) => <td key={cell}>{String(value)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ZxPage>
  );
}

export default function AcademicoPage() {
  const { role, section } = useParams<{ role: string; section: string }>();
  const authorized = useDemoGuard(role, ["funcionario", "direcao"]);
  if (!authorized) return null;

  if (section === "lancar-notas") return <GradesSection role={role} />;
  if (section === "diario") return <DiarySection role={role} />;
  if (section === "horarios") return <ScheduleSection role={role} />;
  const config = lists[section];
  if (!config || (config.adminOnly && role !== "direcao")) notFound();
  return <ListSection id={section} config={config} role={role} />;
}
