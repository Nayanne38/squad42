'use client'

import { ArrowLeft, LockKeyhole, Mail } from 'lucide-react'
import { useParams } from 'next/navigation'

const roleCopy = {
  aluno: { title: 'Login do Aluno', subtitle: 'Acesse suas notas, horários e comunicados.', label: 'Aluno' },
  responsavel: { title: 'Login do Responsável', subtitle: 'Acompanhe o desempenho do seu filho.', label: 'Responsável' },
  funcionario: { title: 'Login do Funcionário', subtitle: 'Acesse o painel administrativo da escola.', label: 'Funcionário' },
} as const

export default function LoginPage() {
  const { role } = useParams<{ role: string }>()
  const copy = roleCopy[role as keyof typeof roleCopy] ?? roleCopy.aluno

  return <main className="login-page"><section className="login-panel"><a className="login-back" href="/"><ArrowLeft size={16} /> Voltar para seleção de perfil</a><div className="login-brand"><div className="brand-mark">Z<span>²</span></div><div><strong>ZENIX EDUCATION</strong><small>Sistema de Gestão Escolar</small></div></div><div className="login-heading"><span className="login-role">{copy.label}</span><h1>{copy.title}</h1><p>{copy.subtitle}</p></div><form className="login-form" onSubmit={(event) => event.preventDefault()}><label htmlFor="email">E-mail</label><div className="login-input"><Mail size={17} /><input id="email" name="email" type="email" placeholder="seu@email.com" required /></div><label htmlFor="password">Senha</label><div className="login-input"><LockKeyhole size={17} /><input id="password" name="password" type="password" placeholder="Digite sua senha" required /></div><button type="submit" className="login-submit">Entrar</button></form><p className="login-note">Use suas credenciais institucionais para acessar a plataforma.</p></section><section className="login-visual" aria-label="Área institucional do Colégio CEPI"><div className="institutional-panel"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7Ezo2vTuYX5AbUDY3GNV6xgjvUfGqs.png" alt="Colégio CEPI Expansão" /><span>Educação que transforma</span></div></section></main>
}
