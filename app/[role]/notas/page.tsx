
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const disciplinas = [
  { nome: "Matemática", notas: [8.0, 7.5, 9.0, 8.5] },
  { nome: "Português", notas: [9.0, 8.5, 8.0, 9.5] },
  { nome: "História", notas: [7.0, 8.0, 8.5, 9.0] },
  { nome: "Geografia", notas: [8.5, 9.0, 7.5, 8.0] },
  { nome: "Biologia", notas: [6.0, 7.0, 8.0, 8.5] },
  { nome: "Física", notas: [5.5, 6.5, 7.0, 8.0] },
  { nome: "Química", notas: [7.5, 8.0, 8.5, 9.0] },
  { nome: "Inglês", notas: [9.5, 9.0, 9.5, 10.0] },
];

export default function NotasPage() {
  const { role } = useParams<{ role: string }>();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [bimestre, setBimestre] = useState(0);

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

  const notasAtuais = disciplinas.map((disciplina) => ({
    nome: disciplina.nome,
    nota: disciplina.notas[bimestre],
  }));

  const mediaGeral =
    notasAtuais.reduce((total, item) => total + item.nota, 0) /
    notasAtuais.length;

  function situacao(nota: number) {
    if (nota >= 7) return "Aprovado";
    if (nota >= 5) return "Recuperação";
    return "Atenção";
  }

  return (
    <main className="grades-page">
      <header className="grades-header">
        <Link href={`/${role}`} className="grades-back">
          ← Voltar ao dashboard
        </Link>
        <span>ZENIX EDUCATION</span>
      </header>

      <section className="grades-welcome">
        <div>
          <small>ÁREA ACADÊMICA</small>
          <h1>Boletim escolar</h1>
          <p>Consulte suas notas e seu desempenho acadêmico.</p>
        </div>
        <div className="grades-avatar">Z</div>
      </section>

      <section className="grades-student">
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

      <section className="grades-content">
        <div className="grades-title">
          <div>
            <h2>Notas por disciplina</h2>
            <p>Selecione o bimestre que deseja consultar.</p>
          </div>
        </div>

        <div className="bimester-selector">
          {[0, 1, 2, 3].map((item) => (
            <button
              key={item}
              onClick={() => setBimestre(item)}
              className={bimestre === item ? "active" : ""}
            >
              {item + 1}º Bimestre
            </button>
          ))}
        </div>

        <div className="grades-table-wrapper">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Disciplina</th>
                <th>Nota</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {notasAtuais.map((item) => (
                <tr key={item.nome}>
                  <td>{item.nome}</td>
                  <td>
                    <strong>{item.nota.toFixed(1)}</strong>
                  </td>
                  <td>
                    <span
                      className={`grade-status ${situacao(item.nota)
                        .toLowerCase()
                        .replace("ç", "c")}`}
                    >
                      {situacao(item.nota)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grades-summary">
          <div>
            <small>MÉDIA GERAL DO BIMESTRE</small>
            <strong>{mediaGeral.toFixed(2)}</strong>
          </div>
          <div>
            <small>DISCIPLINAS</small>
            <strong>{disciplinas.length}</strong>
          </div>
          <div>
            <small>ANO LETIVO</small>
            <strong>2026</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
