
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Atividade = {
  id: number;
  disciplina: string;
  titulo: string;
  descricao: string;
  data: string;
  tipo: "Conteúdo" | "Atividade" | "Trabalho";
  status: "conteudo" | "pendente" | "concluida";
};

const atividadesIniciais: Atividade[] = [
  {
    id: 1,
    disciplina: "Matemática",
    titulo: "Funções do segundo grau",
    descricao: "Estudo de gráficos, raízes e vértice da parábola.",
    data: "2026-11-03",
    tipo: "Conteúdo",
    status: "conteudo",
  },
  {
    id: 2,
    disciplina: "Português",
    titulo: "Interpretação textual",
    descricao: "Exercícios de interpretação e análise de textos.",
    data: "2026-11-04",
    tipo: "Conteúdo",
    status: "conteudo",
  },
  {
    id: 3,
    disciplina: "História",
    titulo: "Trabalho sobre Brasil República",
    descricao: "Produzir um resumo sobre a Primeira República.",
    data: "2026-11-09",
    tipo: "Trabalho",
    status: "pendente",
  },
  {
    id: 4,
    disciplina: "Biologia",
    titulo: "Exercícios de genética",
    descricao: "Resolver as questões das páginas 42 a 45.",
    data: "2026-11-12",
    tipo: "Atividade",
    status: "pendente",
  },
  {
    id: 5,
    disciplina: "Geografia",
    titulo: "Urbanização brasileira",
    descricao: "Anotações e discussão sobre crescimento urbano.",
    data: "2026-11-05",
    tipo: "Conteúdo",
    status: "conteudo",
  },
  {
    id: 6,
    disciplina: "Física",
    titulo: "Lista de exercícios",
    descricao: "Resolver a lista sobre movimento uniforme.",
    data: "2026-11-15",
    tipo: "Atividade",
    status: "concluida",
  },
  {
    id: 7,
    disciplina: "Química",
    titulo: "Pesquisa sobre ligações químicas",
    descricao: "Pesquisar os principais tipos de ligações químicas.",
    data: "2026-11-18",
    tipo: "Trabalho",
    status: "pendente",
  },
];

function formatarData(data: string) {
  return new Date(`${data}T12:00:00`).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

export default function AgendaPage() {
  const { role } = useParams<{ role: string }>();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [atividades, setAtividades] = useState(atividadesIniciais);
  const [filtro, setFiltro] = useState("todos");

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

  function concluirAtividade(id: number) {
    setAtividades((atuais) =>
      atuais.map((atividade) =>
        atividade.id === id
          ? { ...atividade, status: "concluida" }
          : atividade
      )
    );
  }

  const atividadesFiltradas = atividades.filter((atividade) => {
    if (filtro === "pendentes") {
      return atividade.status === "pendente";
    }

    if (filtro === "concluidas") {
      return atividade.status === "concluida";
    }

    return true;
  });

  const pendentes = atividades.filter(
    (item) => item.status === "pendente"
  ).length;

  const concluidas = atividades.filter(
    (item) => item.status === "concluida"
  ).length;

  return (
    <main className="agenda-page">
      <header className="agenda-header">
        <Link href={`/${role}`} className="agenda-back">
          ← Voltar ao dashboard
        </Link>
        <span>ZENIX EDUCATION</span>
      </header>

      <section className="agenda-welcome">
        <div>
          <small>ÁREA ACADÊMICA</small>
          <h1>Agenda de aulas</h1>
          <p>Acompanhe conteúdos, trabalhos e atividades escolares.</p>
        </div>
        <div className="agenda-avatar">Z</div>
      </section>

      <section className="agenda-student">
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

      <section className="agenda-content">
        <div className="agenda-title">
          <div>
            <h2>Atividades escolares</h2>
            <p>Organize suas tarefas e acompanhe seu progresso.</p>
          </div>
        </div>

        <div className="agenda-summary">
          <div>
            <small>PENDENTES</small>
            <strong>{pendentes}</strong>
          </div>

          <div>
            <small>CONCLUÍDAS</small>
            <strong>{concluidas}</strong>
          </div>

          <div>
            <small>TOTAL DE REGISTROS</small>
            <strong>{atividades.length}</strong>
          </div>
        </div>

        <div className="agenda-filters">
          {[
            ["todos", "Todas"],
            ["pendentes", "Pendentes"],
            ["concluidas", "Concluídas"],
          ].map(([valor, nome]) => (
            <button
              key={valor}
              onClick={() => setFiltro(valor)}
              className={filtro === valor ? "active" : ""}
            >
              {nome}
            </button>
          ))}
        </div>

        <div className="agenda-list">
          {atividadesFiltradas.length > 0 ? (
            atividadesFiltradas.map((atividade) => (
              <article
                className="agenda-item"
                key={atividade.id}
              >
                <div className="agenda-item-top">
                  <span className={`agenda-type ${
                    atividade.tipo.toLowerCase()
                  }`}>
                    {atividade.tipo}
                  </span>

                  <span className="agenda-date">
                    {formatarData(atividade.data)}
                  </span>
                </div>

                <small className="agenda-subject">
                  {atividade.disciplina}
                </small>

                <h3>{atividade.titulo}</h3>
                <p>{atividade.descricao}</p>

                {atividade.status === "pendente" ? (
                  <button
                    className="agenda-complete"
                    onClick={() =>
                      concluirAtividade(atividade.id)
                    }
                  >
                    Marcar como concluída
                  </button>
                ) : atividade.status === "concluida" ? (
                  <span className="agenda-done">
                    ✓ Atividade concluída
                  </span>
                ) : (
                  <span className="agenda-content-label">
                    Conteúdo ministrado
                  </span>
                )}
              </article>
            ))
          ) : (
            <div className="agenda-empty">
              <p>Nenhuma atividade encontrada neste filtro.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
