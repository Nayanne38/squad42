"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const roleCopy = {
  aluno: {
    title: "Login do Aluno",
    subtitle: "Acesse suas notas, horários e comunicados.",
    label: "Aluno",
    email: "20260011@zenixeducation.com.br",
    password: "ZxDt2NjdpGuq#41",
  },
  responsavel: {
    title: "Login do Responsável",
    subtitle: "Acompanhe o desempenho do seu filho.",
    label: "Responsável",
    email: "responsavel@zenixeducation.com.br",
    password: "ZxfurWbZnely#76",
  },
  funcionario: {
    title: "Login do Funcionário",
    subtitle: "Acesse o painel administrativo da escola.",
    label: "Funcionário",
    email: "fernanda.lima@zenixeducation.com.br",
    password: "admin123",
    alternateEmail: "admin@zenixeducation.com.br",
    alternatePassword: "ZxygsZeQg3Hp#88",
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
        : "/funcionario";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const sessionRole = isAlternate ? "admin" : role;
      sessionStorage.setItem("zenix-demo-session", sessionRole);
      setMessage("Acesso demonstrativo liberado. Bem-vindo à Zenix Education!");
      window.setTimeout(
        () => router.push(isAlternate ? "/admin" : destination),
        250,
      );
      return;
    }
    setMessage("E-mail ou senha inválidos para este perfil.");
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <a className="login-back" href="/">
          <ArrowLeft size={16} /> Voltar para seleção de perfil
        </a>
        <div className="login-brand">
          <div className="brand-mark">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wFyGlMnsahCQvyrvutRb3pDL8xSyw9.png"
              alt="Colégio CEPI Expansão"
            />
          </div>
          <div>
            <strong>ZENIX EDUCATION</strong>
            <small>Sistema de Gestão Escolar</small>
          </div>
        </div>
        <div className="login-heading">
          <span className="login-role">{copy.label}</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <div className="login-input">
            <Mail size={17} />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <label htmlFor="password">Senha</label>
          <div className="login-input">
            <LockKeyhole size={17} />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-submit">
            Entrar
          </button>
        </form>
        {message && (
          <p
            className={`login-message ${message.startsWith("Acesso") ? "success" : "error"}`}
            role="status"
          >
            {message}
          </p>
        )}
        <p className="login-note">
          Use suas credenciais institucionais para acessar a plataforma.
        </p>
      </section>
      <section
        className="login-visual"
        aria-label="Área institucional do Colégio CEPI"
      >
        <div className="institutional-panel">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7Ezo2vTuYX5AbUDY3GNV6xgjvUfGqs.png"
            alt="Colégio CEPI Expansão"
          />
          <span>Educação que transforma</span>
        </div>
      </section>
    </main>
  );
}
