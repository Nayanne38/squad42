"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import Link from "next/link";

type Comunicado = {
  id: number;
  titulo: string;
  mensagem: string;
  remetente: string;
  data: string;
  importante: boolean;
  lido: boolean;
};

const comunicadosIniciais: Comunicado[] = [
  {
    id: 1,
    titulo: "Calendário de avaliações",
    mensagem: "As avaliações do quarto bimestre terão início no dia 30 de novembro. Consulte o calendário escolar.",
    remetente: "Coordenação Pedagógica",
    data: "2026-11-24",
    importante: true,
    lido: false,
  },
  {
    id: 2,
    titulo: "Reunião de responsáveis",
    mensagem: "A próxima reunião de responsáveis acontecerá no dia 28 de novembro, às 9h.",
    remetente: "Direção Escolar",
    data: "2026-11-23",
    importante: true,
    lido: false,
  },
  {
    id: 3,
    titulo: "Feira de Ciências",
    mensagem: "As inscrições para a Feira de Ciências estão abertas. Procure seu professor para participar.",
    remetente: "Coordenação Pedagógica",
    data: "2026-11-20",
    importante: false,
    lido: false,
  },
  {
    id: 4,
    titulo: "Atualização cadastral",
    mensagem: "Solicitamos aos responsáveis que mantenham seus dados de contato atualizados na secretaria.",
    remetente: "Secretaria Escolar",
    data: "2026-11-18",
    importante: false,
    lido: true,
  },
  {
    id: 5,
    titulo: "Horário da biblioteca",
    mensagem: "A biblioteca estará disponível durante os intervalos das aulas.",
    remetente: "Direção Escolar",
    data: "2026-11-16",
    importante: false,
    lido: true,
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

export default function ComunicadosPage() {
  const { role } = useParams<{ role: string }>();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [comunicados, setComunicados] = useState(comunicadosIniciais);
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

  function marcarComoLido(id: number) {
    setComunicados((atuais) =>
      atuais.map((comunicado) =>
        comunicado.id === id
          ? { ...comunicado, lido: true }
          : comunicado
      )
    );
  }

  const comunicadosFiltrados = comunicados.filter((item) => {
    if (filtro === "nao-lidos") {
      return !item.lido;
    }

    if (filtro === "importantes") {
      return item.importante;
    }

    return true;
  });

  const naoLidos = comunicados.filter(
    (item) => !item.lido
  ).length;

  const importantes = comunicados.filter(
    (item) => item.importante
  ).length;

  return (
    <main className="comunicados-page">
      <header className="comunicados-header">
        <Link href={`/${role}`} className="comunicados-back">
          ← Voltar ao dashboard
        </Link>
        <span>ZENIX EDUCATION</span>
      </header>

      <section className="comunicados-welcome">
        <div>
          <small>ÁREA ACADÊMICA</small>
          <h1>Comunicados</h1>
          <p>Acompanhe os avisos e informações da escola.</p>
        </div>

        <div className="comunicados-avatar">
          <Megaphone size={26} />
        </div>
      </section>

      <section className="comunicados-content">
        <div className="comunicados-title">
          <h2>Avisos e comunicados</h2>
          <p>Fique por dentro das novidades escolares.</p>
        </div>

        <div className="comunicados-summary">
          <div>
            <small>NÃO LIDOS</small>
            <strong>{naoLidos}</strong>
          </div>

          <div>
            <small>IMPORTANTES</small>
            <strong>{importantes}</strong>
          </div>

          <div>
            <small>TOTAL DE COMUNICADOS</small>
            <strong>{comunicados.length}</strong>
          </div>
        </div>

        <div className="comunicados-filters">
          {[
            ["todos", "Todos"],
            ["nao-lidos", "Não lidos"],
            ["importantes", "Importantes"],
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

        <div className="comunicados-list">
          {comunicadosFiltrados.length > 0 ? (
            comunicadosFiltrados.map((item) => (
              <article
                key={item.id}
                className={`comunicados-item ${
                  !item.lido ? "nao-lido" : ""
                }`}
              >
                <div className="comunicados-item-top">
                  <div className="comunicados-tags">
                    {item.importante && (
                      <span className="comunicados-important">
                        Importante
                      </span>
                    )}

                    {!item.lido && (
                      <span className="comunicados-new">
                        Novo
                      </span>
                    )}
                  </div>

                  <span className="comunicados-date">
                    {formatarData(item.data)}
                  </span>
                </div>

                <small className="comunicados-sender">
                  {item.remetente}
                </small>

                <h3>{item.titulo}</h3>
                <p>{item.mensagem}</p>

                {!item.lido ? (
                  <button
                    className="comunicados-read"
                    onClick={() => marcarComoLido(item.id)}
                  >
                    Marcar como lido
                  </button>
                ) : (
                  <span className="comunicados-done">
                    ✓ Comunicado lido
                  </span>
                )}
              </article>
            ))
          ) : (
            <div className="comunicados-empty">
              Nenhum comunicado encontrado.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}