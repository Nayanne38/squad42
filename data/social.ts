export type SocialRole = "aluno" | "responsavel" | "funcionario";
export type Post = {
  id: number;
  name: string;
  profile: string;
  date: string;
  text: string;
  image?: string;
  initials: string;
  color: string;
  likes: number;
  comments: number;
};
export type Group = {
  id: number;
  title: string;
  subject: string;
  members: string;
  color: string;
  icon: string;
};
export type Video = {
  id: number;
  title: string;
  professor: string;
  duration: string;
  color: string;
  initials: string;
  videoUrl?: string;
};
export type Hobby = {
  id: number;
  title: string;
  description: string;
  emoji: string;
  color: string;
};
export type Contact = {
  id: number;
  name: string;
  profile: string;
  initials: string;
  color: string;
  online: boolean;
};
export type Message = {
  id: number;
  contactId: number;
  text: string;
  mine: boolean;
  time: string;
};
export type SchoolClass = {
  id: number;
  name: string;
  room: string;
  students: number;
  subject: string;
};

export const mockPosts: Post[] = [
  {
    id: 1,
    name: "Mariana Costa",
    profile: "Professora de Ciências",
    date: "Hoje, 09:42",
    text: "A ciência está em todos os lugares! Compartilhando alguns registros da nossa experiência de hoje.",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&q=80",
    initials: "MC",
    color: "blue",
    likes: 24,
    comments: 0,
  },
  {
    id: 2,
    name: "João Pedro",
    profile: "Aluno · 8º Ano A",
    date: "Ontem, 16:20",
    text: "Muito feliz com o resultado do nosso projeto de leitura. Parabéns a toda a turma!",
    initials: "JP",
    color: "green",
    likes: 18,
    comments: 0,
  },
  {
    id: 3,
    name: "Fernanda Lima",
    profile: "Coordenação Pedagógica",
    date: "12 de maio",
    text: "Lembrete: a reunião de responsáveis acontecerá na próxima quinta-feira, às 18h30.",
    initials: "FL",
    color: "purple",
    likes: 31,
    comments: 0,
  },
];
export const mockGroups: Group[] = [
  {
    id: 1,
    title: "8º Ano A",
    subject: "Matemática",
    members: "28 participantes",
    color: "blue",
    icon: "∑",
  },
  {
    id: 2,
    title: "Clube de Leitura",
    subject: "Literatura",
    members: "16 participantes",
    color: "purple",
    icon: "✦",
  },
  {
    id: 3,
    title: "Experimentos",
    subject: "Ciências",
    members: "22 participantes",
    color: "green",
    icon: "⚗",
  },
  {
    id: 4,
    title: "Inglês em Foco",
    subject: "Língua Inglesa",
    members: "19 participantes",
    color: "orange",
    icon: "A",
  },
];
export const mockVideos: Video[] = [
  {
    id: 1,
    title: "Introdução às frações",
    professor: "Prof. Ricardo Mendes",
    duration: "12 min",
    color: "blue",
    initials: "RM",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 2,
    title: "A formação do relevo",
    professor: "Prof. Mariana Costa",
    duration: "18 min",
    color: "green",
    initials: "MC",
  },
  {
    id: 3,
    title: "Reading strategies",
    professor: "Prof. Ana Beatriz",
    duration: "15 min",
    color: "purple",
    initials: "AB",
  },
];
export const mockHobbies: Hobby[] = [
  {
    id: 1,
    title: "Música",
    description: "Compartilhe suas músicas e descubra novos sons.",
    emoji: "♫",
    color: "purple",
  },
  {
    id: 2,
    title: "Esportes",
    description: "Encontre colegas para praticar e torcer juntos.",
    emoji: "◉",
    color: "green",
  },
  {
    id: 3,
    title: "Arte e criatividade",
    description: "Desenhos, pinturas e ideias que inspiram.",
    emoji: "✦",
    color: "orange",
  },
  {
    id: 4,
    title: "Tecnologia",
    description: "Converse sobre inovação, jogos e programação.",
    emoji: "⌘",
    color: "blue",
  },
];
export const mockContacts: Contact[] = [
  {
    id: 1,
    name: "Mariana Costa",
    profile: "Professora de Ciências",
    initials: "MC",
    color: "blue",
    online: true,
  },
  {
    id: 2,
    name: "João Pedro",
    profile: "Aluno · 8º Ano A",
    initials: "JP",
    color: "green",
    online: true,
  },
  {
    id: 3,
    name: "Fernanda Lima",
    profile: "Coordenação Pedagógica",
    initials: "FL",
    color: "purple",
    online: false,
  },
  {
    id: 4,
    name: "Ana Beatriz",
    profile: "Professora de Inglês",
    initials: "AB",
    color: "orange",
    online: true,
  },
];
export const mockMessages: Message[] = [
  {
    id: 1,
    contactId: 1,
    text: "Olá! Como posso ajudar você hoje?",
    mine: false,
    time: "09:40",
  },
  {
    id: 2,
    contactId: 1,
    text: "Oi, professora! Gostaria de tirar uma dúvida sobre a atividade.",
    mine: true,
    time: "09:41",
  },
  {
    id: 3,
    contactId: 1,
    text: "Claro, pode enviar sua dúvida por aqui.",
    mine: false,
    time: "09:42",
  },
];
export const mockClasses: SchoolClass[] = [
  {
    id: 1,
    name: "8º Ano A",
    room: "Sala 12",
    students: 28,
    subject: "Ensino Fundamental II",
  },
  {
    id: 2,
    name: "7º Ano B",
    room: "Sala 08",
    students: 25,
    subject: "Ensino Fundamental II",
  },
  {
    id: 3,
    name: "9º Ano A",
    room: "Sala 15",
    students: 30,
    subject: "Ensino Fundamental II",
  },
];
