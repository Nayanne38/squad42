"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const roleCopy = {
  aluno: {
    title: "Login do Aluno",
    subtitle: "Acesse suas notas, horários e comunicados.",
    label: "Aluno",
    email: "rafael@cepi.com",
    password: "rafael123",
  },
  responsavel: {
    title: "Login do Responsável",
    subtitle: "Acompanhe o desempenho do seu filho.",
    label: "Responsável",
    email: "fabricya@cepi.com",
    password: "fabricya123",
  },
  funcionario: {
    title: "Login da Docência",
    subtitle: "Professores e direção / coordenação.",
    label: "Docência",
    email: "fernanda@cepi.com",
    password: "fernanda123",
    alternateEmail: "fabricya.direcao@cepi.com",
    alternatePassword: "fabricya123",
  },
  admin: {
    title: "Login da Administração",
    subtitle: "Controle de pessoas, acessos e segurança do sistema (TI).",
    label: "Administração (TI)",
    email: "admin@cepi.com",
    password: "admin123",
  },
} as const;

export default function LoginPage() {
  const { role } = useParams<{ role: string }>();
  const router = useRouter();
  const copy = roleCopy[role as keyof typeof roleCopy] ?? roleCopy.aluno;
  const destination =
    role === "aluno"
      ? "/aluno"
      : role === "responsavel"
        ? "/responsavel"
        : role === "admin"
          ? "/admin"
          : "/funcionario";
  // Login de demonstração já preenchido: basta clicar em "Entrar".
  const [email, setEmail] = useState<string>(copy.email);
  const [password, setPassword] = useState<string>(copy.password);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isPrimary =
      email.trim().toLowerCase() === copy.email && password === copy.password;
    const isAlternate =
      "alternateEmail" in copy &&
      email.trim().toLowerCase() === copy.alternateEmail &&
      password === copy.alternatePassword;
    if (isPrimary || isAlternate) {
      const sessionRole = isAlternate ? "direcao" : role;
      sessionStorage.setItem("zenix-demo-session", sessionRole);
      setMessage("Acesso demonstrativo liberado. Bem-vindo à Zenix Education!");
      window.setTimeout(
        () => router.push(isAlternate ? "/direcao" : destination),
        250,
      );
      return;
    }
    setMessage("E-mail ou senha inválidos para este perfil.");
  }

  return (
    <main className="fg-split">
      <section className="fg-left">
        <div className="fg-box login">
          <a className="fg-back" href="/">
            <ArrowLeft size={14} /> Voltar para seleção de perfil
          </a>
          <h1>Acesse sua conta</h1>
          <p className="fg-sub">Entre com seu e-mail e senha para continuar.</p>
          <form className="fg-form" onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nome@escola.com.br"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <div className="fg-row">
              <label className="fg-check"><input type="checkbox" /> Lembrar de mim</label>
              <button type="button" className="fg-link" onClick={() => setMessage("Recuperação de senha indisponível no modo demonstração.")}>Esqueci minha senha</button>
            </div>
            <button type="submit" className="fg-submit">Entrar</button>
          </form>
          {"alternateEmail" in copy && (
            <div className="login-demo-switch">
              <button
                type="button"
                onClick={() => {
                  setEmail(copy.email);
                  setPassword(copy.password);
                  setMessage("");
                }}
              >
                Professora
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail(copy.alternateEmail);
                  setPassword(copy.alternatePassword);
                  setMessage("");
                }}
              >
                Direção / Coordenação
              </button>
            </div>
          )}
          {message && (
            <p
              className={`login-message ${message.startsWith("Acesso") ? "success" : "error"}`}
              role="status"
            >
              {message}
            </p>
          )}
          <p className="fg-foot">
            Perfil: {copy.label}. Modo demonstração: o login já vem preenchido, é só clicar em Entrar.
          </p>
        </div>
      </section>
      <section className="fg-right" aria-label="Colégio CEPI Expansão">
        <i className="fg-tri a" /><i className="fg-tri b" /><i className="fg-tri c" />
        <img src="/logo-cepi.png" alt="Colégio CEPI Expansão" />
      </section>
    </main>
  );
}
