'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  Menu,
  NotebookPen,
  Search,
  Settings,
  ShieldAlert,
  Users,
  UserRound,
  X,
} from 'lucide-react'

const cepiLogo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7Ezo2vTuYX5AbUDY3GNV6xgjvUfGqs.png'

type Role = 'Aluno' | 'Responsável' | 'Funcionário'
type View = 'home' | 'student' | 'responsible' | 'admin'

const quickItems = [
  ['Comunicados', 'Avisos e comunicados', Megaphone, 'blue'],
  ['Notas', 'Boletim por bimestre', ClipboardList, 'green'],
  ['Horários', 'Grade de aulas', CalendarDays, 'purple'],
  ['Calendário', 'Eventos e feriados', CalendarDays, 'indigo'],
  ['Agenda de aulas', 'Registros de aulas', BookOpen, 'teal'],
  ['Ocorrências', 'Registros disciplinares', ShieldAlert, 'orange'],
  ['Perfil', 'Dados do aluno', Settings, 'slate'],
] as const

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <div className="brand-mark"><img src={cepiLogo} alt="Colégio CEPI Expansão" /></div>
      {!compact && <div><strong>ZENIX EDUCATION</strong><small>Sistema de Gestão Escolar</small></div>}
    </div>
  )
}

function Header({ onMenu }: { onMenu: () => void }) {
  return <header className="topbar"><button className="mobile-menu" onClick={onMenu} aria-label="Abrir menu"><Menu size={20} /></button><Brand compact /><div className="search"><Search size={15} /><span>Para onde você quer ir?</span></div><div className="top-actions"><Bell size={18} /><div className="avatar">RM</div><ChevronDown size={14} /></div></header>
}

function SideNav({ view, setView, open, userName = 'Administrador Modelo', userEmail = 'admin@zenixeducation.com...', professor = false }: { view: View; setView: (v: View) => void; open: boolean; userName?: string; userEmail?: string; professor?: boolean }) {
  const professorMenu = <><div className="nav-section"><span>PROFESSOR <ChevronDown size={12} /></span><button><BookOpen size={15} /> Minhas Turmas</button><button><ClipboardList size={15} /> Lançamento de Notas</button><button><NotebookPen size={15} /> Diário de Classe</button><button><CalendarDays size={15} /> Horários</button><button><BookOpen size={15} /> Reforço / Extras</button><button><ShieldAlert size={15} /> Ocorrências</button><button><CalendarDays size={15} /> Calendário</button></div><div className="nav-section"><span>COMUNIDADE <ChevronDown size={12} /></span><a className="nav-link" href="/funcionario/rede-social/feed"><MessageCircle size={15} /> Rede Social Escolar</a></div><div className="nav-section"><span>CONTA <ChevronDown size={12} /></span><button><UserRound size={15} /> Perfil</button></div></>
  return <aside className={`sidenav ${open ? 'open' : ''}`}><div className="side-brand"><Brand /></div><button className="close-nav" onClick={() => setView(view)} aria-label="Fechar menu"><X size={18} /></button>{professor ? professorMenu : <><div className="nav-section"><span>CADASTRO <ChevronDown size={12} /></span><button><Users size={15} /> Alunos</button><button><UserRound size={15} /> Responsáveis</button><button><BookOpen size={15} /> Turmas</button></div><div className="nav-section"><span>ACADÊMICO <ChevronDown size={12} /></span><button><CalendarDays size={15} /> Calendário</button><button><ClipboardList size={15} /> Lançamento de Notas</button><button><NotebookPen size={15} /> Diário de Classe</button><button><CalendarDays size={15} /> Horários</button><button><BookOpen size={15} /> Reforço / Extras</button><button><ShieldAlert size={15} /> Ocorrências</button></div><div className="nav-section"><span>SIMULADOS E PROVAS <ChevronDown size={12} /></span><button><ClipboardList size={15} /> Banco de Questões</button><button><ClipboardList size={15} /> Simulados</button><button><ClipboardList size={15} /> Provas</button></div><div className="nav-section"><span>PORTARIA <ChevronDown size={12} /></span><button><ShieldAlert size={15} /> Painel ao vivo</button><button><Users size={15} /> Visitantes</button><button><UserRound size={15} /> Autorizações de saída</button><button><ShieldAlert size={15} /> Ocorrências</button><button><ClipboardList size={15} /> Histórico de acesso</button></div></>}<div className="side-user"><div className="avatar green">{userName === 'Administrador Modelo' ? 'AM' : 'FL'}</div><div><b>{userName}</b><small>{userEmail}</small></div></div><button className="logout" onClick={() => setView(view)}>↪ Sair</button></aside>
}

function RoleCard({ role, icon: Icon, color, href }: { role: Role; icon: typeof GraduationCap; color: string; href: string }) {
  return <a className="role-card" href={href}><div className={`role-icon ${color}`}><Icon size={23} /></div><div><strong>Sou {role}</strong><small>{role === 'Aluno' ? 'Acesse notas, horários e comunicados' : role === 'Responsável' ? 'Acompanhe o desempenho do seu filho' : 'Acesse o painel administrativo'}</small></div><ChevronRight size={19} /></a>
}

function Home({ go: _go }: { go: (v: View) => void }) {
  return <main className="landing"><section className="landing-copy"><Brand /><div className="award">♨ <b>43 Anos de Excelência</b></div><h1>Bem-vindo ao<br />Zenix Education</h1><p>Selecione seu perfil para acessar o sistema</p><div className="roles"><RoleCard role="Aluno" icon={GraduationCap} color="green" href="/login/aluno" /><RoleCard role="Responsável" icon={Users} color="cyan" href="/login/responsavel" /><RoleCard role="Funcionário" icon={ClipboardList} color="olive" href="/login/funcionario" /></div><footer>© 2025 Zenix Education · Todos os direitos reservados</footer></section><section className="landing-image" aria-label="Área institucional do Colégio CEPI"><div className="institutional-panel"><img src={cepiLogo} alt="Colégio CEPI Expansão" /><span>Educação que transforma</span></div></section></main>
}

function StudentDashboard({ role, onBack }: { role: 'student' | 'responsible'; onBack: () => void }) {
  const isParent = role === 'responsible'
  return <div className="portal"><div className="portal-head"><Brand compact /><div className="portal-profile"><span>{isParent ? 'RM' : 'AM'}</span><ChevronDown size={14} /></div></div>{isParent ? <><div className="welcome blue-bg"><div className="big-avatar">RM</div><div><small>Portal do Responsável</small><h2>Olá, Responsável!</h2><p>1 aluno vinculado</p></div></div><label className="eyebrow">SELECIONE O ALUNO</label><button className="student-select"><div className="big-avatar small">AM</div><b>Aluno Modelo<br /><small>RA 20260011</small></b><span>Mãe</span></button></> : <div className="welcome green-bg"><div className="big-avatar">Z</div><div><small>Bem-vindo de volta</small><h2>Aluno Modelo 101</h2><p>RA: <b>20260011</b></p></div></div>}<div className="portal-card">{isParent ? <><div className="student-row"><div className="big-avatar small">AM</div><div><b>Aluno Modelo 101</b><small>RA: 20260011</small><span>Pedagógico　 Mãe</span></div></div></> : <div className="card-title"><Megaphone size={16} /> Comunicados recentes <a>Ver todos →</a></div>}<div className="card-title quick-title">ACESSO RÁPIDO</div><div className="quick-grid">{quickItems.map(([name, description, Icon, color]) => <button key={name} className="quick-item"><div className={`quick-icon ${color}`}><Icon size={17} /></div><div><b>{name}</b><small>{description}</small></div><ChevronRight size={15} /></button>)}</div></div><a className="back-button" href={`/ ${isParent ? 'responsavel' : 'aluno'}/rede-social/feed`.replace(' ', '')}>Abrir Rede Social Escolar</a><button className="back-button" onClick={onBack}>Sair</button><footer className="portal-footer">Desenvolvido por ZenixCode</footer></div>
}

function AdminDashboard({ onBack }: { onBack: () => void }) {
  return <div className="admin-shell"><SideNav view="admin" setView={onBack} open={false} /><div className="admin-main"><Header onMenu={() => {}} /><div className="admin-content"><div className="admin-title"><div><h1>Olá, Administrador 👋</h1><p>Aqui está um resumo do portal hoje.</p></div><div className="admin-title-actions"><button className="outline-button"><Settings size={15} /> Personalizar</button><button className="outline-button" onClick={onBack}>Sair</button></div></div><div className="stats"><div><Users size={18} /><b>11</b><span>Alunos</span></div><div><Users size={18} /><b>3</b><span>Responsáveis</span></div><div><BookOpen size={18} /><b>4</b><span>Profissionais</span></div></div><div className="admin-card"><div className="card-title"><span>♨</span> Aniversariantes da semana</div><div className="empty">Nenhum aniversariante nos próximos 7 dias.</div></div><div className="admin-card notices"><div className="card-title"><ShieldAlert size={15} /> Avisos de cadastro <mark>32</mark></div>{[['Alunos sem responsável financeiro','Alunos ativos que não têm responsável financeiro cadastrado.','11'],['Alunos sem data de nascimento','Alunos ativos cujo cadastro não tem data de nascimento.','10'],['Alunos sem foto','Alunos ativos sem foto no cadastro.','11']].map(([a,b,n]) => <div className="notice" key={a}><ShieldAlert size={17} /><div><b>{a}</b><small>{b}</small></div><mark>{n}</mark><ChevronDown size={14} /></div>)}</div><div className="admin-card"><div className="card-title quick-title">ACESSO RÁPIDO</div><div className="admin-links"><a href="/funcionario/rede-social/feed"><MessageCircle size={16} /> Rede Social Escolar</a>{['Gerenciar alunos','Gerenciar turmas','Enviar mensagem','Mensagens em massa','Equipe','Configurações'].map(x => <button key={x}><Settings size={16} />{x}</button>)}</div></div></div></div></div>
}

function ProfessorDashboard({ onBack }: { onBack: () => void }) {
  return <div className="admin-shell"><SideNav view="admin" setView={onBack} open={false} userName="Fernanda Lima" userEmail="fernanda.lima@zenixeducation.com..." professor /><div className="admin-main"><Header onMenu={() => {}} /><div className="admin-content"><div className="admin-title"><div><h1>Olá, Fernanda 👋</h1><p>Aqui está um resumo das suas atividades de hoje.</p></div><div className="admin-title-actions"><button className="outline-button" onClick={onBack}>Sair</button></div></div><div className="stats"><div><BookOpen size={18} /><b>4</b><span>Turmas</span></div><div><ClipboardList size={18} /><b>28</b><span>Alunos</span></div><div><CalendarDays size={18} /><b>6</b><span>Aulas hoje</span></div></div><div className="admin-card"><div className="card-title"><NotebookPen size={15} /> Acesso rápido</div><div className="admin-links"><button><BookOpen size={16} /> Turmas</button><button><ClipboardList size={16} /> Lançamento de Notas</button><button><NotebookPen size={16} /> Diário de Classe</button><button><CalendarDays size={16} /> Horários</button><button><BookOpen size={16} /> Reforço / Extras</button><button><ShieldAlert size={16} /> Ocorrências</button></div></div><div className="admin-card"><div className="card-title"><CalendarDays size={15} /> Próximas aulas</div><div className="empty">Nenhuma aula registrada para hoje.</div></div></div></div></div>
}

export function AreaDashboard({ area }: { area: 'admin' | 'aluno' | 'responsavel' | 'funcionario' }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const session = sessionStorage.getItem('zenix-demo-session')
    const expected = area === 'admin' ? 'admin' : area
    if (session === expected) setAuthorized(true)
    else router.replace('/')
  }, [area, router])

  function logout() {
    sessionStorage.removeItem('zenix-demo-session')
    router.replace('/')
  }

  if (!authorized) return null
  if (area === 'admin') return <AdminDashboard onBack={logout} />
  if (area === 'funcionario') return <ProfessorDashboard onBack={logout} />
  return <StudentDashboard role={area === 'responsavel' ? 'responsible' : 'student'} onBack={logout} />
}

export default function Page() {
  const [view, setView] = useState<View>('home')
  if (view === 'home') return <Home go={setView} />
  if (view === 'admin') return <AdminDashboard onBack={() => setView('home')} />
  return <StudentDashboard role={view} onBack={() => setView('home')} />
}
