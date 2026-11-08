
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Evento = {
  data: string;
  titulo: string;
  tipo: string;
  descricao: string;
};

const eventos: Evento[] = [
  {
    data: "2026-11-05",
    titulo: "Prova de Matemática",
    tipo: "prova",
    descricao: "Avaliação sobre funções e equações.",
  },
  {
    data: "2026-11-09",
    titulo: "Entrega de trabalho",
    tipo: "atividade",
    descricao: "Entrega do trabalho de História.",
  },
  {
    data: "2026-11-12",
    titulo: "Prova de Português",
    tipo: "prova",
    descricao: "Avaliação de interpretação textual.",
  },
  {
    data: "2026-11-18",
    titulo: "Reunião de responsáveis",
    tipo: "reuniao",
    descricao: "Reunião escolar às 18h.",
  },
  {
    data: "2026-11-20",
    titulo: "Feira de Ciências",
    tipo: "evento",
    descricao: "Apresentação dos projetos dos alunos.",
  },
  {
    data: "2026-11-25",
    titulo: "Prova de Biologia",
    tipo: "prova",
    descricao: "Avaliação sobre genética.",
  },
];

const diasSemana = [
  "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom",
];

function formatarData(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export default function CalendarioPage() {
  const { role } = useParams<{ role: string }>();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [mesAtual, setMesAtual] = useState(
    new Date(2026, 10, 1)
  );

  const [dataSelecionada, setDataSelecionada] = useState(
    "2026-11-04"
  );

  useEffect(() => {
    const session = sessionStorage.getItem("zenix-demo-session");

    if (
      session === role &&
      (role === "aluno" || role === "responsavel")
    ) {
      setAuthorized(true);
    } else {
      router.replace("/");
    }
  }, [role, router]);

  if (!authorized) return null;

  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();

  const primeiroDia = new Date(ano, mes, 1);
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  // Ajusta a semana para começar na segunda-feira.
  const deslocamento = (primeiroDia.getDay() + 6) % 7;

  const quantidadeCelulas =
    Math.ceil((deslocamento + diasNoMes) / 7) * 7;

  const diasCalendario = Array.from(
    { length: quantidadeCelulas },
    (_, i) =>
      new Date(ano, mes, i - deslocamento + 1)
  );

  function mudarMes(direcao: number) {
    const novoMes = new Date(ano, mes + direcao, 1);

    setMesAtual(novoMes);
    setDataSelecionada(formatarData(novoMes));
  }

  const eventosSelecionados = eventos.filter(
    (evento) => evento.data === dataSelecionada
  );

  return (
    <main className="calendar-page">
      <header className="calendar-header">
        <Link href={`/${role}`} className="calendar-back">
          ← Voltar ao dashboard
        </Link>
        <span>ZENIX EDUCATION</span>
      </header>

      <section className="calendar-welcome">
        <div>
          <small>ÁREA ACADÊMICA</small>
          <h1>Calendário escolar</h1>
          <p>Acompanhe provas, eventos e atividades escolares.</p>
        </div>
        <div className="calendar-avatar">Z</div>
      </section>

      <section className="calendar-student">
        <div>
          <small>ALUNO</small>
          <strong>Aluno Modelo 101</strong>
        </div>
        <div>
          <small>REGISTRO ACADÊMICO</small>
          <strong>20260011</strong>
        </div>
        <div>
          <small>ANO LETIVO</small>
          <strong>2026</strong>
        </div>
      </section>

      <section className="calendar-content">
        <div className="calendar-month-header">
          <div>
            <h2>
              {mesAtual.toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <p>Selecione uma data para consultar os eventos.</p>
          </div>

          <div className="calendar-navigation">
            <button onClick={() => mudarMes(-1)}>
              ←
            </button>
            <button onClick={() => mudarMes(1)}>
              →
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {diasSemana.map((dia) => (
            <div className="calendar-weekday" key={dia}>
              {dia}
            </div>
          ))}

          {diasCalendario.map((data) => {
            const chave = formatarData(data);

            const temEvento = eventos.some(
              (evento) => evento.data === chave
            );

            const mesmoMes = data.getMonth() === mes;

            return (
              <button
                key={chave}
                onClick={() => setDataSelecionada(chave)}
                className={`calendar-day
                  ${mesmoMes ? "" : "other-month"}
                  ${dataSelecionada === chave ? "selected" : ""}
                `}
              >
                <span>{data.getDate()}</span>

                {temEvento && (
                  <span className="calendar-dot" />
                )}
              </button>
            );
          })}
        </div>

        <div className="calendar-legend">
          <span>
            <i className="calendar-dot" />
            Data com evento
          </span>
          <span>
            <i className="calendar-selected-dot" />
            Data selecionada
          </span>
        </div>

        <div className="calendar-events">
          <div className="calendar-events-header">
            <div>
              <h3>Eventos do dia</h3>
              <p>
                {new Date(
                  `${dataSelecionada}T12:00:00`
                ).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {eventosSelecionados.length > 0 ? (
            eventosSelecionados.map((evento) => (
              <article
                className="calendar-event"
                key={evento.titulo}
              >
                <span className={`event-type ${evento.tipo}`}>
                  {evento.tipo === "prova"
                    ? "Prova"
                    : evento.tipo === "atividade"
                    ? "Atividade"
                    : evento.tipo === "reuniao"
                    ? "Reunião"
                    : "Evento"}
                </span>

                <strong>{evento.titulo}</strong>
                <p>{evento.descricao}</p>
              </article>
            ))
          ) : (
            <div className="calendar-empty">
              <p>Nenhum evento programado para esta data.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
