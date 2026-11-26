"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Megaphone } from "lucide-react";
import Link from "next/link";
import { useDemoGuard } from "@/lib/demo-session";
import { getClass, readSelectedStudent, schoolClasses } from "@/data/shared/school";

const STORAGE_KEY = "zenix-comunicados-publicados";
const PUBLISHERS = ["funcionario", "direcao"];

type Comunicado = {
  id: number;
  titulo: string;
  mensagem: string;
  remetente: string;
  data: string;
  importante: boolean;
  lido: boolean;
  /** Turma que recebe o aviso; vazio = todas as turmas. */
  turma?: string;
  publicado?: boolean;
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

  const authorized = useDemoGuard(role, ["aluno", "responsavel", "funcionario", "direcao"]);
  const podePublicar = PUBLISHERS.includes(role);
  const [publicados, setPublicados] = useState<Comunicado[]>([]);
  const [lidos, setLidos] = useState<number[]>([]);
  const [turmaDoAluno, setTurmaDoAluno] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [titulo, setTitulo] = useState("");
  const [mensagemNova, setMensagemNova] = useState("");
  const [turmaDestino, setTurmaDestino] = useState("");
  const [importanteNovo, setImportanteNovo] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) setPublicados(JSON.parse(salvo));
    } catch {
      /* sem armazenamento: apenas os comunicados iniciais */
    }
    if (role === "aluno" || role === "responsavel") {
      setTurmaDoAluno(getClass(readSelectedStudent(role).classId)?.name ?? "");
    }
  }, [role]);

  if (!authorized) return null;

  const todos = [...publicados, ...comunicadosIniciais].map((item) => ({
    ...item,
    lido: item.lido || lidos.includes(item.id) || podePublicar,
  }));
  // Aluno e responsável só veem avisos de todas as turmas ou da turma do aluno selecionado.
  const comunicados = todos.filter(
    (item) => podePublicar || !item.turma || item.turma === turmaDoAluno
  );

  function salvarPublicados(lista: Comunicado[]) {
    setPublicados(lista);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {
      /* ignora */
    }
  }

  function publicar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSucesso("");
    if (titulo.trim().length < 3) return setErro("Informe um título com pelo menos 3 caracteres.");
    if (mensagemNova.trim().length < 5) return setErro("Escreva a mensagem do aviso.");
    setErro("");
    const hoje = new Date();
    const data = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
    salvarPublicados([
      {
        id: Date.now(),
        titulo: titulo.trim(),
        mensagem: mensagemNova.trim(),
        remetente: role === "direcao" ? "Direção · Marina Albuquerque" : "Fernanda Lima · Professora",
        data,
        importante: importanteNovo,
        lido: false,
        turma: turmaDestino || undefined,
        publicado: true,
      },
      ...publicados,
    ]);
    setTitulo("");
    setMensagemNova("");
    setImportanteNovo(false);
    setSucesso("Aviso publicado! Alunos e responsáveis da turma já podem vê-lo.");
  }

  function excluirPublicado(id: number) {
    salvarPublicados(publicados.filter((item) => item.id !== id));
  }

  function marcarComoLido(id: number) {
    setLidos((atuais) => (atuais.includes(id) ? atuais : [...atuais, id]));
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
        <img className="zx-logo" src="/logo-cepi.png" alt="Colégio CEPI Expansão" />
      </header>

      <section className="comunicados-welcome">
        <div>
          <small>ÁREA ACADÊMICA</small>
          <h1>Comunicados</h1>
          <p>
            {podePublicar
              ? "Publique avisos para as turmas e acompanhe os comunicados enviados."
              : "Acompanhe os avisos e informações da escola."}
          </p>
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

        {podePublicar && (
          <form className="comunicados-compose" onSubmit={publicar} noValidate>
            <strong>Publicar novo aviso</strong>
            <label htmlFor="aviso-titulo">Título</label>
            <input id="aviso-titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <label htmlFor="aviso-mensagem">Mensagem</label>
            <textarea id="aviso-mensagem" value={mensagemNova} onChange={(e) => setMensagemNova(e.target.value)} />
            <label htmlFor="aviso-turma">Destinatários</label>
            <select id="aviso-turma" value={turmaDestino} onChange={(e) => setTurmaDestino(e.target.value)}>
              <option value="">Todas as turmas</option>
              {schoolClasses.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <label className="comunicados-check">
              <input type="checkbox" checked={importanteNovo} onChange={(e) => setImportanteNovo(e.target.checked)} />
              Marcar como importante
            </label>
            {erro && <p className="zx-error">{erro}</p>}
            {sucesso && <p className="zx-success" role="status">{sucesso}</p>}
            <div className="zx-actions">
              <button type="submit" className="primary-button">Publicar aviso</button>
            </div>
          </form>
        )}

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
                  {item.turma ? ` · ${item.turma}` : ""}
                </small>

                <h3>{item.titulo}</h3>
                <p>{item.mensagem}</p>

                {podePublicar ? (
                  item.publicado ? (
                    <button className="comunicados-read" onClick={() => excluirPublicado(item.id)}>
                      Excluir aviso
                    </button>
                  ) : null
                ) : !item.lido ? (
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