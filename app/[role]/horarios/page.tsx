
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const horarios = [
  {
    hora: "07:00 - 07:50",
    segunda: "Matemática",
    terca: "Português",
    quarta: "História",
    quinta: "Biologia",
    sexta: "Geografia",
  },
  {
    hora: "07:50 - 08:40",
    segunda: "Português",
    terca: "Matemática",
    quarta: "Geografia",
    quinta: "Química",
    sexta: "História",
  },
  {
    hora: "08:40 - 09:30",
    segunda: "História",
    terca: "Biologia",
    quarta: "Matemática",
    quinta: "Português",
    sexta: "Inglês",
  },
  {
    hora: "09:50 - 10:40",
    segunda: "Física",
    terca: "Química",
    quarta: "Português",
    quinta: "Matemática",
    sexta: "Biologia",
  },
  {
    hora: "10:40 - 11:30",
    segunda: "Inglês",
    terca: "Geografia",
    quarta: "Física",
    quinta: "História",
    sexta: "Matemática",
  },
];

const dias = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
];

const nomesDias = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
];

export default function HorariosPage() {
  const { role } = useParams<{ role: string }>();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

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

  return (
    <main className="schedule-page">
      <header className="schedule-header">
        <Link href={`/${role}`} className="schedule-back">
          ← Voltar ao dashboard
        </Link>
        <span>ZENIX EDUCATION</span>
      </header>

      <section className="schedule-welcome">
        <div>
          <small>ÁREA ACADÊMICA</small>
          <h1>Horários de aulas</h1>
          <p>Consulte sua grade semanal de disciplinas.</p>
        </div>
        <div className="schedule-avatar">Z</div>
      </section>

      <section className="schedule-student">
        <div>
          <small>ALUNO</small>
          <strong>Aluno Modelo 101</strong>
        </div>
        <div>
          <small>TURMA</small>
          <strong>1º Ano</strong>
        </div>
        <div>
          <small>TURNO</small>
          <strong>Matutino</strong>
        </div>
      </section>

      <section className="schedule-content">
        <div className="schedule-title">
          <div>
            <h2>Grade semanal</h2>
            <p>Horários e disciplinas da semana.</p>
          </div>
        </div>

        <div className="schedule-table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Horário</th>
                {nomesDias.map((dia) => (
                  <th key={dia}>{dia}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {horarios.map((aula) => (
                <tr key={aula.hora}>
                  <td className="schedule-time">
                    {aula.hora}
                  </td>

                  {dias.map((dia) => (
                    <td key={dia}>
                      <span className="schedule-subject">
                        {aula[dia as keyof typeof aula]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="schedule-legend">
          <span>5 dias letivos</span>
          <span>25 aulas semanais</span>
          <span>Turno matutino</span>
        </div>
      </section>
    </main>
  );
}
