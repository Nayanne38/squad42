"use client";

import { useState, type FormEvent } from "react";
import {
  CURRENT_GUARDIAN_ID,
  CURRENT_STAFF_ID,
  getClass,
  getClassesOfStaff,
  getStudentsOfClass,
  getStudentsOfGuardian,
  schoolClasses,
  staff,
} from "@/data/shared/school";
import {
  childReports,
  classEngagement,
  lastActivities,
  participationLabels,
  weekdayPosts,
} from "@/data/shared/rede-social";
import { Bar, Circle, Modal, PageHead, Pills, StatCard, barTone } from "@/components/rede-social/ui";
import type { SocialStore } from "@/components/rede-social/store";

const classKey = (name: string) => name.replace(" Ano ", " ");
const engagementOf = (className: string) => classEngagement.find((item) => item.className === classKey(className))?.value ?? 60;

/* ---------------------------- Responsável ---------------------------- */

export function ChildrenView() {
  const children = getStudentsOfGuardian(CURRENT_GUARDIAN_ID);
  const [selectedId, setSelectedId] = useState(children[0].id);
  const child = children.find((item) => item.id === selectedId) ?? children[0];
  const report = childReports[child.id] ?? childReports[1];

  return (
    <>
      <PageHead title="Meus filhos" subtitle="Acompanhe cada filho no mesmo login" />
      <div className="rs-pills" role="tablist" aria-label="Escolha o filho">
        {children.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={item.id === child.id} className={item.id === child.id ? "active" : ""} onClick={() => setSelectedId(item.id)}>
            {item.name.split(" ")[0]} · {getClass(item.classId)?.name.replace(" Ano ", " ano ")}
          </button>
        ))}
      </div>
      <div className="rs-stats">
        <StatCard label="Frequência" value={report.attendance} hint="no mês" tone="green" />
        <StatCard label="Média geral" value={report.average} hint="1º semestre" tone="indigo" />
        <StatCard label="Faltas" value={report.absences} hint={`justificadas: ${report.justified}`} tone="gold" />
        <StatCard label="Próximo prazo" value={report.nextDeadline.split(" · ")[0]} hint={report.nextDeadline.split(" · ")[1]} tone="red" />
      </div>
      <div className="rs-panel">
        <table className="rs-table">
          <thead>
            <tr><th>DISCIPLINA</th><th>PROFESSOR</th><th>MÉDIA</th><th>FALTAS</th></tr>
          </thead>
          <tbody>
            {report.subjects.map((subject) => (
              <tr key={subject.name}>
                <td>{subject.name}</td><td>{subject.teacher}</td><td>{subject.average}</td><td>{subject.absences}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function NoticesView({ store }: { store: SocialStore }) {
  const [filter, setFilter] = useState<"Todos" | "Novos" | "Lidos">("Todos");
  const list = store.notices.filter((item) => filter === "Todos" || (filter === "Novos") === !item.read);
  const unread = store.notices.filter((item) => !item.read).length;
  const [confirmed, setConfirmed] = useState<number[]>([]);

  return (
    <>
      <PageHead title="Comunicados" subtitle={`Avisos oficiais da escola · ${unread} novos`} />
      <Pills options={["Todos", "Novos", "Lidos"] as const} value={filter} onChange={setFilter} ariaLabel="Filtrar comunicados" />
      {list.length === 0 ? (
        <p className="rs-empty">Nenhum comunicado neste filtro.</p>
      ) : (
        <div className="rs-stack">
          {list.map((item) => (
            <article className="rs-panel notice" key={item.id}>
              <div className="rs-row">
                <h3>{item.title}</h3>
                <span className={`rs-badge ${item.read ? "draft" : "new"}`}>{item.read ? "Lido" : "Novo"}</span>
              </div>
              <small>{item.from} · {item.when}</small>
              <p>{item.text}</p>
              <div className="rs-actions">
                {item.title === "Reunião de pais" && (
                  <button type="button" className="rs-primary" disabled={confirmed.includes(item.id)} onClick={() => { setConfirmed((current) => [...current, item.id]); store.markNoticeRead(item.id); }}>
                    {confirmed.includes(item.id) ? "Presença confirmada" : "Confirmar presença"}
                  </button>
                )}
                {!item.read && <button type="button" className="rs-outline" onClick={() => store.markNoticeRead(item.id)}>Marcar como lido</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

/* ------------------------------ Professor ------------------------------ */

export function TeacherClassesView({ store }: { store: SocialStore }) {
  const classes = getClassesOfStaff(CURRENT_STAFF_ID);
  const [selectedId, setSelectedId] = useState(classes[0].id);
  const current = classes.find((item) => item.id === selectedId) ?? classes[0];
  const roster = getStudentsOfClass(current.id);
  const openDoubts = store.doubtList.filter((item) => !item.answer && item.className === classKey(current.name)).length;
  const engagement = engagementOf(current.name);

  return (
    <>
      <PageHead title="Minhas turmas" subtitle={`${staff[0].subject} · Ensino Fundamental II`} />
      <div className="rs-pills" role="tablist" aria-label="Escolha a turma">
        {classes.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={item.id === current.id} className={item.id === current.id ? "active" : ""} onClick={() => setSelectedId(item.id)}>
            {item.name.replace(" Ano ", " ano ")}
          </button>
        ))}
      </div>
      <div className="rs-stats three">
        <StatCard label="Alunos" value={roster.length} hint="ativos" tone="indigo" />
        <StatCard label="Engajamento" value={`${engagement}%`} hint="na semana" tone="green" />
        <StatCard label="Dúvidas" value={openDoubts} hint="abertas" tone="gold" />
      </div>
      <div className="rs-panel">
        <table className="rs-table">
          <thead>
            <tr><th>ALUNO</th><th>PARTICIPAÇÃO</th><th>ÚLTIMA ATIVIDADE</th><th>STATUS</th></tr>
          </thead>
          <tbody>
            {roster.map((student, index) => {
              const level = participationLabels[(student.id + index) % 3];
              return (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{level}</td>
                  <td>{lastActivities[(student.id + index) % lastActivities.length]}</td>
                  <td><span className={`rs-badge ${level === "Baixa" ? "warn" : "ok"}`}>{level === "Baixa" ? "Atenção" : "Em dia"}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function DoubtsView({ store }: { store: SocialStore }) {
  const [filter, setFilter] = useState("Todas");
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const classes = Array.from(new Set(store.doubtList.map((item) => item.className)));
  const open = store.doubtList.filter((item) => !item.answer);

  const list = store.doubtList.filter((item) => {
    if (filter === "Respondidas") return !!item.answer;
    if (filter === "Todas") return !item.answer;
    return !item.answer && item.className === filter;
  });

  const answer = (id: number, suffix = "") => {
    const text = (drafts[id] ?? "").trim();
    if (text.length < 3 && !suffix) return setErrors((current) => ({ ...current, [id]: "Escreva a resposta antes de enviar." }));
    setErrors((current) => ({ ...current, [id]: "" }));
    store.setDoubtList((current) => current.map((item) => (item.id === id ? { ...item, answer: text ? `${text}${suffix}` : suffix.trim() } : item)));
  };

  return (
    <>
      <PageHead title="Dúvidas" subtitle={`Responda e marque como verificada · ${open.length} abertas`} />
      <Pills options={["Todas", ...classes, "Respondidas"]} value={filter} onChange={setFilter} ariaLabel="Filtrar dúvidas" />
      {list.length === 0 ? (
        <p className="rs-empty">Nenhuma dúvida neste filtro.</p>
      ) : (
        <div className="rs-stack">
          {list.map((item) => (
            <article className="rs-panel" key={item.id}>
              <div className="rs-person">
                <Circle text={item.student[0]} />
                <div><b>{item.student}</b><small>{item.className} · {item.when}</small></div>
              </div>
              <p className="rs-question">{item.question}</p>
              {item.answer ? (
                <p className="rs-answer"><b>Resposta verificada:</b> {item.answer}</p>
              ) : (
                <>
                  <textarea className="rs-textarea" placeholder="Sua resposta" aria-label={`Resposta para ${item.student}`} value={drafts[item.id] ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: event.target.value }))} />
                  {errors[item.id] && <p className="rs-error">{errors[item.id]}</p>}
                  <div className="rs-actions">
                    <button type="button" className="rs-primary" onClick={() => answer(item.id)}>Responder e verificar</button>
                    <button type="button" className="rs-outline" onClick={() => answer(item.id, " (veja a vídeo-aula indicada)")}>Indicar vídeo</button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}

/* ----------------------------- Coordenação ----------------------------- */

export function ModerationView({ store }: { store: SocialStore }) {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<"Responsáveis" | "Alunos" | "Equipe">("Responsáveis");
  const [error, setError] = useState("");
  const [sentMsg, setSentMsg] = useState("");

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim().length < 5) return setError("Escreva a mensagem do comunicado.");
    store.sendNotice(message.trim().slice(0, 60), audience);
    setMessage("");
    setError("");
    setSentMsg("Comunicado enviado.");
  };

  return (
    <>
      <PageHead title="Moderação da comunidade" />
      <div className="rs-stats">
        <StatCard label="Publicações hoje" value={128} hint="+12% que ontem" tone="green" />
        <StatCard label="Denúncias abertas" value={store.reports.length} hint="revisar hoje" tone="red" />
        <StatCard label="Grupos pendentes" value={store.approvals.length} hint="aguardando" tone="gold" />
        <StatCard label="Engajamento" value="74%" hint="alunos ativos" tone="indigo" />
      </div>
      <div className="rs-two">
        <div className="rs-stack">
          <section className="rs-panel">
            <h2>Aprovações pendentes</h2>
            {store.approvals.length === 0 && <p className="rs-empty">Nada pendente.</p>}
            {store.approvals.map((item) => (
              <div className="rs-row line" key={item.id}>
                <div><b>{item.kind}: {item.title}</b><small>Criado por {item.by}</small></div>
                <div className="rs-actions">
                  <button type="button" className="rs-primary" onClick={() => store.decideApproval(item.id, true)}>Aprovar</button>
                  <button type="button" className="rs-outline danger" onClick={() => store.decideApproval(item.id, false)}>Recusar</button>
                </div>
              </div>
            ))}
          </section>
          <section className="rs-panel danger-top">
            <h2>Denúncias</h2>
            {store.reports.length === 0 && <p className="rs-empty">Nenhuma denúncia aberta.</p>}
            {store.reports.map((item) => (
              <div key={item.id} className="rs-report">
                <b>{item.title} <span className="rs-badge warn">{item.reason}</span></b>
                <small>{item.by}</small>
                <div className="rs-actions">
                  <button type="button" className="rs-danger" onClick={() => store.decideReport(item.id, true)}>Remover comentário</button>
                  <button type="button" className="rs-outline" onClick={() => store.decideReport(item.id, false)}>Manter</button>
                </div>
              </div>
            ))}
          </section>
        </div>
        <div className="rs-stack">
          <form className="rs-panel yellow" onSubmit={send} noValidate>
            <h2>Novo comunicado</h2>
            <label htmlFor="notice-msg">Mensagem</label>
            <textarea id="notice-msg" className="rs-textarea" value={message} onChange={(event) => setMessage(event.target.value)} />
            <div className="rs-pills" role="radiogroup" aria-label="Destinatários">
              {(["Responsáveis", "Alunos", "Equipe"] as const).map((option) => (
                <button key={option} type="button" role="radio" aria-checked={audience === option} className={audience === option ? "active" : ""} onClick={() => setAudience(option)}>{option}</button>
              ))}
            </div>
            {error && <p className="rs-error">{error}</p>}
            {sentMsg && <p className="rs-note-msg" role="status">{sentMsg}</p>}
            <button type="submit" className="rs-yellow">Enviar</button>
          </form>
          <section className="rs-panel">
            <h2>Regras da comunidade</h2>
            <p className="rs-muted">Respeito entre todos · Sem exposição de dados sensíveis · Chat de responsáveis só com funcionários</p>
          </section>
        </div>
      </div>
    </>
  );
}

export function CoordNoticesView({ store }: { store: SocialStore }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [to, setTo] = useState("Todos");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim().length < 3) return setError("Informe o título do comunicado.");
    store.sendNotice(title.trim(), to);
    setTitle("");
    setError("");
    setOpen(false);
  };

  return (
    <>
      <PageHead title="Comunicados" subtitle="Histórico e alcance" action={<button type="button" className="rs-yellow" onClick={() => setOpen(true)}>+ Novo comunicado</button>} />
      <div className="rs-panel">
        <table className="rs-table">
          <thead><tr><th>COMUNICADO</th><th>PARA</th><th>ENVIADO</th><th>LIDO POR</th></tr></thead>
          <tbody>
            {store.sent.map((item) => (
              <tr key={item.id}>
                <td><b>{item.title}</b></td><td>{item.to}</td><td>{item.sent}</td>
                <td className="bar-cell"><span>{item.read}%</span><Bar value={item.read} tone={item.read < 50 ? "gold" : "green"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <Modal title="Novo comunicado" onClose={() => setOpen(false)}>
          <form className="rs-form" onSubmit={submit} noValidate>
            <label htmlFor="cn-title">Título</label>
            <input id="cn-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Feira de ciências" />
            <label htmlFor="cn-to">Destinatários</label>
            <select id="cn-to" value={to} onChange={(event) => setTo(event.target.value)}>
              <option>Todos</option><option>Responsáveis EF II</option><option>Responsáveis e alunos</option><option>Equipe</option>
            </select>
            {error && <p className="rs-error">{error}</p>}
            <button type="submit" className="rs-yellow center">Enviar comunicado</button>
          </form>
        </Modal>
      )}
    </>
  );
}

export function CoordClassesView() {
  return (
    <>
      <PageHead title="Turmas" subtitle="Ensino Fundamental II" />
      <div className="rs-panel">
        <table className="rs-table">
          <thead><tr><th>TURMA</th><th>PROFESSORES</th><th>ALUNOS</th><th>ENGAJAMENTO</th></tr></thead>
          <tbody>
            {schoolClasses.map((item) => {
              const value = engagementOf(item.name);
              return (
                <tr key={item.id}>
                  <td><b>{item.name.replace(" Ano ", " ano ")}</b></td>
                  <td>{item.teacherIds.length}</td>
                  <td>{getStudentsOfClass(item.id).length}</td>
                  <td className="bar-cell"><span>{value}%</span><Bar value={value} tone={barTone(value)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function ReportsView({ store }: { store: SocialStore }) {
  const [msg, setMsg] = useState("");
  return (
    <>
      <PageHead title="Relatórios" subtitle="Uso da plataforma · novembro" action={<button type="button" className="rs-yellow" onClick={() => setMsg("Relatório gerado (demonstração: nenhum arquivo é criado).")}>Exportar PDF</button>} />
      {msg && <p className="rs-note-msg" role="status">{msg}</p>}
      <div className="rs-stats">
        <StatCard label="Usuários ativos" value="3.920" hint="de 4.000" tone="green" />
        <StatCard label="Publicações" value="2.810" hint="no mês" tone="indigo" />
        <StatCard label="Mensagens" value="6.340" hint="no mês" tone="gold" />
        <StatCard label="Denúncias" value={14 + (store.resolvedReports - 12)} hint={`resolvidas: ${store.resolvedReports}`} tone="red" />
      </div>
      <section className="rs-panel">
        <h2>Publicações por dia da semana</h2>
        <div className="rs-chart" role="img" aria-label="Publicações por dia da semana">
          {weekdayPosts.map((item) => (
            <div key={item.day}><i style={{ height: `${item.value}%` }} /><span>{item.day}</span></div>
          ))}
        </div>
      </section>
    </>
  );
}
