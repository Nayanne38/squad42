// Dados simulados da rede social, seguindo as telas do Figma (sem banco de dados).
import type { Group, Post, SocialRole } from "./social";

export const CEPI_LOGO =
  "/logo-cepi.png";

export type Identity = {
  name: string;
  firstName: string;
  initials: string;
  badge: string;
  subtitle: string;
  dashboard: string;
};

/** Quem está "conectado" em cada perfil da rede social. */
export const socialIdentity: Record<SocialRole, Identity> = {
  aluno: {
    name: "Rafael da Silva Moura",
    firstName: "Aluno",
    initials: "RM",
    badge: "Perfil · Aluno",
    subtitle: "Aluno · 8º ano – Turma A · Ensino Fundamental II",
    dashboard: "/aluno",
  },
  responsavel: {
    name: "Fabricya Nayanne Santos",
    firstName: "Fabricya",
    initials: "FN",
    badge: "Perfil · Responsável",
    subtitle: "Responsável · Mãe de Rafael da Silva Moura (8º ano A)",
    dashboard: "/responsavel",
  },
  funcionario: {
    name: "Fernanda Lima",
    firstName: "Fernanda",
    initials: "FL",
    badge: "Perfil · Professor",
    subtitle: "Professora · Coordenação Pedagógica · Ensino Fundamental II",
    dashboard: "/funcionario",
  },
  coordenacao: {
    name: "Fabricya Nayanne Santos",
    firstName: "Fabricya",
    initials: "FN",
    badge: "Perfil · Coordenação",
    subtitle: "Diretora · Direção e Coordenação · Ensino Fundamental II",
    dashboard: "/direcao",
  },
};

export type NavItem = { key: string; label: string; icon: string };

/** Menu lateral de cada perfil (ordem do Figma). */
export const socialNav: Record<SocialRole, NavItem[]> = {
  aluno: [
    { key: "feed", label: "Feed", icon: "feed" },
    { key: "video-aulas", label: "Vídeo Aulas", icon: "video" },
    { key: "murais", label: "Murais", icon: "mural" },
    { key: "grupos", label: "Grupos de Estudo", icon: "groups" },
    { key: "chat", label: "Mensagens", icon: "chat" },
    { key: "hobbies", label: "Hobbies", icon: "hobby" },
    { key: "perfil", label: "Perfil", icon: "profile" },
  ],
  responsavel: [
    { key: "feed", label: "Feed", icon: "feed" },
    { key: "filhos", label: "Meus filhos", icon: "groups" },
    { key: "comunicados", label: "Comunicados", icon: "megaphone" },
    { key: "murais", label: "Murais", icon: "mural" },
    { key: "chat", label: "Mensagens", icon: "chat" },
    { key: "perfil", label: "Perfil", icon: "profile" },
  ],
  funcionario: [
    { key: "feed", label: "Feed", icon: "feed" },
    { key: "turmas", label: "Minhas turmas", icon: "groups" },
    { key: "video-aulas", label: "Vídeo Aulas", icon: "video" },
    { key: "murais", label: "Murais", icon: "mural" },
    { key: "duvidas", label: "Dúvidas", icon: "help" },
    { key: "chat", label: "Mensagens", icon: "chat" },
    { key: "perfil", label: "Perfil", icon: "profile" },
  ],
  coordenacao: [
    { key: "feed", label: "Feed", icon: "feed" },
    { key: "moderacao", label: "Moderação", icon: "shield" },
    { key: "comunicados", label: "Comunicados", icon: "megaphone" },
    { key: "turmas", label: "Turmas", icon: "groups" },
    { key: "chat", label: "Mensagens", icon: "chat" },
    { key: "relatorios", label: "Relatórios", icon: "chart" },
    { key: "perfil", label: "Perfil", icon: "profile" },
  ],
};

export const feedSeed: Post[] = [
  {
    id: 101,
    name: "Prof. Luan Santana Souza",
    profile: "Professor · Matemática",
    date: "há 1h",
    text: "Pessoal, segue o resumo de Função Quadrática para a revisão de sexta. Vértice, raízes e gráfico em uma página só.",
    initials: "LS",
    color: "dark",
    likes: 19,
    comments: 7,
  },
  {
    id: 102,
    name: "Atabisio Henry",
    profile: "8º ano A",
    date: "há 3h",
    text: "Alguém pode me ajudar com o exercício de raiz quadrada, pfv?",
    initials: "AH",
    color: "gray",
    likes: 10,
    comments: 5,
  },
  {
    id: 103,
    name: "Coordenação CEPI",
    profile: "Oficial",
    date: "há 5h",
    text: "Lembrete: feira de ciências na próxima quinta. Inscreva sua turma até sexta.",
    initials: "CC",
    color: "blue",
    likes: 31,
    comments: 2,
  },
];

feedSeed.push(
  { id: 104, name: "Rafael da Silva Moura", profile: "8º ano A", date: "há 3 dias", text: "Terminei o resumo de Geografia sobre relevo e hidrografia. Quem quiser estudar junto, é só chamar no grupo.", initials: "RM", color: "blue", likes: 6, comments: 1 },
  { id: 105, name: "Fernanda Lima", profile: "Professora", date: "há 2 dias", text: "Lembrete: entrega do trabalho de Ciências na próxima segunda. Dúvidas, me chamem no chat.", initials: "FL", color: "purple", likes: 9, comments: 2 },
);

export const feedSeedCoordenacao: Post[] = [feedSeed[2], feedSeed[0]];
export const feedSeedResponsavel: Post[] = [
  {
    id: 201,
    name: "Coordenação CEPI",
    profile: "Comunicado · Oficial",
    date: "há 2h",
    text: "Reunião de pais do Ensino Fundamental II na terça, às 18h30. Confirme sua presença abaixo.",
    initials: "CC",
    color: "blue",
    likes: 12,
    comments: 0,
  },
  {
    id: 202,
    name: "Prof. Luan Santana Souza",
    profile: "Matemática · há 1d",
    date: "há 1d",
    text: "A prova de sexta cobrirá Função Quadrática. O resumo está no mural da turma.",
    initials: "LS",
    color: "dark",
    likes: 8,
    comments: 0,
  },
];

export type Deadline = { subject: string; detail: string; due: string };
export const weekDeadlines: Deadline[] = [
  { subject: "Matemática", detail: "págs. 54 a 67", due: "30/11" },
  { subject: "Geografia", detail: "apostila", due: "30/11" },
  { subject: "Português", detail: "págs. 54 a 67", due: "02/12" },
];

export type NoteKind = "atividade" | "prova" | "aviso";
export type BoardNote = {
  id: number;
  subject: string;
  due: string;
  detail: string;
  kind: NoteKind;
  done: boolean;
  hidden: boolean;
};
export const boardNotes: BoardNote[] = [
  { id: 1, subject: "Matemática", due: "30/11", detail: "Págs. 54 a 67", kind: "atividade", done: false, hidden: false },
  { id: 2, subject: "Geografia", due: "30/11", detail: "Apostila", kind: "atividade", done: false, hidden: false },
  { id: 3, subject: "História", due: "01/12", detail: "Apostila", kind: "prova", done: false, hidden: false },
  { id: 4, subject: "Português", due: "02/12", detail: "Págs. 54 a 67", kind: "atividade", done: false, hidden: false },
  { id: 5, subject: "Ciências", due: "03/12", detail: "Págs. 70 a 75", kind: "prova", done: false, hidden: false },
  { id: 6, subject: "Inglês", due: "04/12", detail: "Apostila", kind: "aviso", done: true, hidden: false },
];

export type LibraryVideo = {
  id: number;
  title: string;
  professor: string;
  duration: string;
  color: string;
  initials: string;
  videoUrl?: string;
  youtubeId?: string;
  subject: string;
  description: string;
  progress: number;
  isNew?: boolean;
  views: number;
  status: "Publicado" | "Rascunho";
  classes: string;
};
export const videoLibrary: LibraryVideo[] = [
  {
    id: 1,
    youtubeId: "ZZO9jwHdl40",
    title: "Função Quadrática: introdução",
    professor: "Prof. Luan Santana Souza",
    duration: "YouTube",
    color: "green",
    initials: "LS",
    subject: "Matemática",
    description: "Conceito, forma geral e o papel dos coeficientes.",
    progress: 100,
    views: 214,
    status: "Publicado",
    classes: "7º A e 7º B",
  },
  {
    id: 2,
    youtubeId: "nLvQ_tbGUMI",
    title: "Vértice e raízes",
    professor: "Prof. Luan Santana Souza",
    duration: "YouTube",
    color: "green",
    initials: "LS",
    subject: "Matemática",
    description: "Como encontrar o vértice e usar a fórmula de Bhaskara.",
    progress: 62,
    views: 187,
    status: "Publicado",
    classes: "7º A",
  },
  {
    id: 3,
    youtubeId: "8NhDE9-IG_w",
    title: "Resolvendo exercícios",
    professor: "Prof. Luan Santana Souza",
    duration: "YouTube",
    color: "green",
    initials: "LS",
    subject: "Matemática",
    description: "Resolução comentada dos exercícios das páginas 54 a 67.",
    progress: 0,
    isNew: true,
    views: 96,
    status: "Rascunho",
    classes: "Não publicado",
  },
  {
    id: 4,
    youtubeId: "68ZCvCZ5idA",
    title: "Interpretação de texto",
    professor: "Profa. Lúcia",
    duration: "YouTube",
    color: "green",
    initials: "PL",
    subject: "Português",
    description: "Estratégias para ler e entender enunciados.",
    progress: 0,
    views: 58,
    status: "Publicado",
    classes: "8º A",
  },
  {
    id: 5,
    youtubeId: "c49l7HjQCeE",
    title: "Relevo e hidrografia",
    professor: "Prof. Davi",
    duration: "YouTube",
    color: "green",
    initials: "PD",
    subject: "Geografia",
    description: "Formas de relevo e bacias hidrográficas do Brasil.",
    progress: 0,
    views: 71,
    status: "Publicado",
    classes: "8º A",
  },
  {
    id: 6,
    youtubeId: "byb71MxuSDU",
    title: "O ciclo da água",
    professor: "Profa. Rita",
    duration: "YouTube",
    color: "green",
    initials: "PR",
    subject: "Ciências",
    description: "Evaporação, condensação e precipitação.",
    progress: 0,
    views: 64,
    status: "Publicado",
    classes: "8º A",
  },
];

export const studyGroupCatalog: Group[] = [
  { id: 1, title: "Matemática · 8º ano", subject: "Matemática", members: "24 membros", color: "green", icon: "∑" },
  { id: 2, title: "Geografia · 8º ano", subject: "Geografia", members: "18 membros", color: "green", icon: "G" },
  { id: 3, title: "História · 8º ano", subject: "História", members: "21 membros", color: "green", icon: "H" },
  { id: 4, title: "Português · 8º ano", subject: "Português", members: "27 membros", color: "green", icon: "P" },
  { id: 5, title: "Ciências · 8º ano", subject: "Ciências", members: "16 membros", color: "green", icon: "C" },
  { id: 6, title: "Inglês · 8º ano", subject: "Inglês", members: "14 membros", color: "green", icon: "E" },
  { id: 7, title: "Redação", subject: "Redação", members: "12 membros", color: "green", icon: "R" },
  { id: 8, title: "Revisão para provas", subject: "Revisão", members: "33 membros", color: "green", icon: "★" },
];

export type HobbyItem = { id: number; title: string; members: number; category: string };
export const hobbyCatalog: HobbyItem[] = [
  { id: 1, title: "Xadrez", members: 19, category: "Jogos" },
  { id: 2, title: "Fotografia", members: 11, category: "Artes" },
  { id: 3, title: "Violão", members: 9, category: "Música" },
  { id: 4, title: "Futebol", members: 38, category: "Esportes" },
  { id: 5, title: "Desenho", members: 15, category: "Artes" },
  { id: 6, title: "Robótica", members: 13, category: "Jogos" },
  { id: 7, title: "Teatro", members: 17, category: "Artes" },
  { id: 8, title: "Leitura", members: 22, category: "Artes" },
];
export const hobbyCategories = ["Todos", "Esportes", "Artes", "Jogos", "Música"];

export type Achievement = { letter: string; label: string; color: string };
export const achievements: Achievement[] = [
  { letter: "S", label: "Sequência de 7 dias", color: "green" },
  { letter: "A", label: "Ajudante", color: "indigo" },
  { letter: "10", label: "Nota 10", color: "gold" },
  { letter: "L", label: "Leitor", color: "red" },
  { letter: "G", label: "Líder de grupo", color: "green" },
  { letter: "X", label: "Enxadrista", color: "dark" },
];

export type SchoolNotice = { id: number; title: string; from: string; when: string; text: string; read: boolean };
export const schoolNotices: SchoolNotice[] = [
  { id: 1, title: "Reunião de pais", from: "Coordenação", when: "há 2h", text: "Terça, 18h30, no auditório. Confirme sua presença.", read: false },
  { id: 2, title: "Calendário de provas", from: "Secretaria", when: "ontem", text: "As provas do 4º bimestre começam em 08/12. O cronograma completo está em anexo.", read: false },
  { id: 3, title: "Recesso escolar", from: "Direção", when: "20/11", text: "Não haverá aula na sexta, 28/11. As atividades retornam normalmente na segunda.", read: true },
];

export type ChildReport = {
  attendance: string;
  average: string;
  absences: number;
  justified: number;
  nextDeadline: string;
  status: string;
  subjects: { name: string; teacher: string; average: string; absences: number }[];
};
export const childReports: Record<number, ChildReport> = {
  1: {
    attendance: "96%",
    average: "8,4",
    absences: 3,
    justified: 2,
    nextDeadline: "30/11 · Matemática",
    status: "Em dia",
    subjects: [
      { name: "Matemática", teacher: "Prof. Luan", average: "8,5", absences: 1 },
      { name: "Português", teacher: "Profa. Lúcia", average: "9,0", absences: 0 },
      { name: "Geografia", teacher: "Prof. Davi", average: "7,8", absences: 2 },
      { name: "Ciências", teacher: "Profa. Rita", average: "8,3", absences: 0 },
    ],
  },
  2: {
    attendance: "91%",
    average: "7,9",
    absences: 5,
    justified: 3,
    nextDeadline: "01/12 · História",
    status: "1 aviso",
    subjects: [
      { name: "Matemática", teacher: "Prof. Luan", average: "7,6", absences: 2 },
      { name: "Português", teacher: "Profa. Lúcia", average: "8,4", absences: 1 },
      { name: "Geografia", teacher: "Prof. Davi", average: "7,2", absences: 2 },
      { name: "Ciências", teacher: "Profa. Rita", average: "8,0", absences: 0 },
    ],
  },
};

export type Doubt = { id: number; student: string; className: string; question: string; when: string; answer?: string };
export const doubts: Doubt[] = [
  { id: 1, student: "Atabisio Henry", className: "8º A", question: "Como fatorar a raiz de 144?", when: "há 3h" },
  { id: 2, student: "Rafael da Silva Moura", className: "8º A", question: "Qual a diferença entre raiz e potência?", when: "há 5h" },
  { id: 3, student: "Lucas Andrade", className: "7º B", question: "O vértice sempre é o ponto mais baixo?", when: "há 1d" },
];

export type ClassEngagement = { className: string; value: number };
export const classEngagement: ClassEngagement[] = [
  { className: "8º A", value: 82 },
  { className: "7º B", value: 64 },
  { className: "9º A", value: 47 },
  { className: "6º A", value: 71 },
];

export const participationLabels = ["Alta", "Média", "Baixa"] as const;
export const lastActivities = ["hoje, 08h12", "ontem", "há 6 dias", "hoje, 07h40"];

export type PendingApproval = { id: number; kind: string; title: string; by: string };
export const pendingApprovals: PendingApproval[] = [
  { id: 1, kind: "Grupo", title: "Clube de Xadrez", by: "Rafael da Silva Moura · 8º A" },
  { id: 2, kind: "Grupo", title: "Robótica 9º ano", by: "Gabriel Souza · 9º A" },
  { id: 3, kind: "Hobby", title: "Fotografia", by: "Atabisio Henry · 8º A" },
];

export const sentNotices = [
  { id: 1, title: "Reunião de pais", to: "Responsáveis EF II", sent: "hoje", read: 41 },
  { id: 2, title: "Calendário de provas", to: "Responsáveis e alunos", sent: "ontem", read: 78 },
  { id: 3, title: "Recesso escolar", to: "Todos", sent: "20/11", read: 95 },
];

export const weekdayPosts = [
  { day: "Seg", value: 62 },
  { day: "Ter", value: 80 },
  { day: "Qua", value: 74 },
  { day: "Qui", value: 91 },
  { day: "Sex", value: 55 },
];

export const engagementColors = ["green", "green", "indigo", "gold", "red"];
