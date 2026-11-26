"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { USER_KEY, demoAccounts, loginGroups } from "@/data/shared/accounts";

const roleCopy = {
  aluno: { subtitle: "Acesse suas notas, horários e comunicados.", label: "Aluno" },
  responsavel: { subtitle: "Acompanhe o desempenho do seu filho.", label: "Responsável" },
  funcionario: { subtitle: "Professores e direção / coordenação.", label: "Docência" },
  admin: { subtitle: "Controle de pessoas, acessos e segurança do sistema (TI).", label: "Administração (TI)" },
} as const;

const destinations = {
  aluno: "/aluno",
  responsavel: "/responsavel",
  funcionario: "/funcionario",
  direcao: "/direcao",
  admin: "/admin",
} as const;

export default function LoginPage() {
  const { role } = useParams<{ role: string }>();
  const router = useRouter();
  const copy = roleCopy[role as keyof typeof roleCopy] ?? roleCopy.aluno;
  const accounts = demoAccounts.filter((item) => (loginGroups[role] ?? loginGroups.aluno).includes(item.session));
  // Login de demonstração já preenchido: basta clicar em "Entrar".
  const [email, setEmail] = useState<string>(accounts[0].email);
  const [password, setPassword] = useState<string>(accounts[0].password);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const account = accounts.find(
      (item) => item.email === email.trim().toLowerCase() && item.password === password,
    );
    if (account) {
      sessionStorage.setItem("zenix-demo-session", account.session);
      sessionStorage.setItem(USER_KEY, account.email);
      setMessage("Acesso demonstrativo liberado. Bem-vindo à Zenix Education!");
      window.setTimeout(() => router.push(destinations[account.session]), 250);
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
          {accounts.length > 1 && (
            <div className="login-demo-switch">
              {accounts.map((item) => (
                <button
                  key={item.email}
                  type="button"
                  onClick={() => {
                    setEmail(item.email);
                    setPassword(item.password);
                    setMessage("");
                  }}
                >
                  {item.shortcut}
                </button>
              ))}
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
