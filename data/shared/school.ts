// Dados simulados da escola (sem banco de dados). Centraliza alunos, responsáveis,
// professores, turmas e as permissões de cada perfil, com seus relacionamentos.

export type AreaRole = "aluno" | "responsavel" | "funcionario" | "direcao" | "admin";

export type SchoolClassRecord = {
  id: number;
  name: string;
  room: string;
  level: string;
  teacherIds: number[];
};

export type Student = {
  id: number;
  name: string;
  ra: string;
  classId: number;
  guardianIds: number[];
  birth?: string;
  hasPhoto: boolean;
};

export type Guardian = {
  id: number;
  name: string;
  email: string;
  phone: string;
  /** Parentesco por aluno vinculado (studentId -> parentesco). */
  relationships: Record<number, string>;
};

export type Staff = {
  id: number;
  name: string;
  email: string;
  position: string;
  subject: string;
  classIds: number[];
};

export const schoolClasses: SchoolClassRecord[] = [
  { id: 1, name: "8º Ano A", room: "Sala 12", level: "Ensino Fundamental II", teacherIds: [2, 3, 6, 7] },
  { id: 2, name: "7º Ano B", room: "Sala 08", level: "Ensino Fundamental II", teacherIds: [2, 4, 7] },
  { id: 3, name: "9º Ano A", room: "Sala 15", level: "Ensino Fundamental II", teacherIds: [3, 4, 6] },
  { id: 4, name: "6º Ano A", room: "Sala 05", level: "Ensino Fundamental II", teacherIds: [2, 4, 7] },
];

export const students: Student[] = [
  { id: 1, name: "Rafael da Silva Moura", ra: "20260011", classId: 1, guardianIds: [1], birth: "2012-03-14", hasPhoto: true },
  { id: 2, name: "Yan Francisco Jesus de Oliveira", ra: "20260012", classId: 4, guardianIds: [], birth: "2014-08-02", hasPhoto: false },
  { id: 3, name: "João Vitor Braz Mourão", ra: "20260013", classId: 1, guardianIds: [2], birth: "2012-06-21", hasPhoto: true },
  { id: 4, name: "Atabisio Henry", ra: "20260014", classId: 1, guardianIds: [3], hasPhoto: false },
  { id: 5, name: "Igor Gabriel", ra: "20260015", classId: 1, guardianIds: [], birth: "2012-11-30", hasPhoto: false },
  { id: 6, name: "Lucas Andrade", ra: "20260016", classId: 2, guardianIds: [], birth: "2013-01-09", hasPhoto: false },
  { id: 7, name: "Beatriz Lima", ra: "20260017", classId: 2, guardianIds: [], hasPhoto: false },
  { id: 8, name: "Pedro Henrique", ra: "20260018", classId: 2, guardianIds: [], birth: "2013-05-18", hasPhoto: false },
  { id: 9, name: "Sofia Martins", ra: "20260019", classId: 3, guardianIds: [], birth: "2011-09-27", hasPhoto: false },
  { id: 10, name: "Gabriel Souza", ra: "20260020", classId: 3, guardianIds: [], hasPhoto: false },
  { id: 11, name: "Laura Oliveira", ra: "20260021", classId: 4, guardianIds: [], birth: "2014-12-05", hasPhoto: false },
];

export const guardians: Guardian[] = [
  { id: 1, name: "Fabricya Nayanne Santos", email: "fabricya@cepi.com", phone: "(81) 99999-0001", relationships: { 1: "Mãe" } },
  { id: 2, name: "Carlos Pedro", email: "carlos.pedro@email.com", phone: "(81) 99999-0002", relationships: { 3: "Pai" } },
  { id: 3, name: "Helena Souza", email: "helena.souza@email.com", phone: "(81) 99999-0003", relationships: { 4: "Mãe" } },
];

export const staff: Staff[] = [
  { id: 2, name: "Mariana Costa", email: "mariana@cepi.com", position: "Professora", subject: "Ciências", classIds: [1, 2, 4] },
  { id: 3, name: "Luan Santana Souza", email: "luan@cepi.com", position: "Professor", subject: "Matemática", classIds: [1, 3] },
  { id: 4, name: "Ana Beatriz", email: "ana@cepi.com", position: "Professora", subject: "Língua Inglesa", classIds: [2, 3, 4] },
  { id: 6, name: "João Vitor Braz Mourão", email: "joao.prof@cepi.com", position: "Professor", subject: "Geografia", classIds: [1, 3] },
  { id: 7, name: "Atabisio Henry", email: "atabisio.prof@cepi.com", position: "Professor", subject: "Língua Portuguesa", classIds: [1, 2, 4] },
];

/** Usuários que representam a sessão DEMO de cada perfil. */
export const CURRENT_STUDENT_ID = 1;
export const CURRENT_GUARDIAN_ID = 1;
export const CURRENT_STAFF_ID = 3;

export const getClass = (id: number) => schoolClasses.find((item) => item.id === id);
export const getStudent = (id: number) => students.find((item) => item.id === id);
export const getStudentsOfClass = (classId: number) => students.filter((item) => item.classId === classId);
export const getStudentsOfGuardian = (guardianId: number) =>
  students.filter((item) => item.guardianIds.includes(guardianId));
export const getGuardiansOfStudent = (studentId: number) =>
  guardians.filter((item) => getStudent(studentId)?.guardianIds.includes(item.id));
export const getClassesOfStaff = (staffId: number) =>
  schoolClasses.filter((item) => item.teacherIds.includes(staffId));

export const SELECTED_STUDENT_KEY = "zenix-selected-student";

/**
 * Aluno exibido nas telas acadêmicas. O aluno vê apenas o próprio cadastro; o responsável
 * só pode escolher entre os alunos vinculados a ele (restrição de privacidade).
 */
export function resolveStudentForRole(role: string, storedId: string | null): Student {
  if (role === "responsavel") {
    const linked = getStudentsOfGuardian(CURRENT_GUARDIAN_ID);
    return linked.find((item) => String(item.id) === storedId) ?? linked[0];
  }
  return getStudent(CURRENT_STUDENT_ID) as Student;
}

export function readSelectedStudent(role: string): Student {
  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem(SELECTED_STUDENT_KEY);
  } catch {
    stored = null;
  }
  return resolveStudentForRole(role, stored);
}

export type RegistrationNotice = { title: string; description: string; students: Student[] };

export function getRegistrationNotices(): RegistrationNotice[] {
  return [
    {
      title: "Alunos sem responsável financeiro",
      description: "Alunos ativos que não têm responsável financeiro cadastrado.",
      students: students.filter((item) => item.guardianIds.length === 0),
    },
    {
      title: "Alunos sem data de nascimento",
      description: "Alunos ativos cujo cadastro não tem data de nascimento.",
      students: students.filter((item) => !item.birth),
    },
    {
      title: "Alunos sem foto",
      description: "Alunos ativos sem foto no cadastro.",
      students: students.filter((item) => !item.hasPhoto),
    },
  ];
}

/** Aniversariantes (mês e dia) em uma janela de dias a partir de hoje. */
export function getUpcomingBirthdays(days = 7, today = new Date()) {
  return students.filter((student) => {
    if (!student.birth) return false;
    const [, month, day] = student.birth.split("-").map(Number);
    for (let offset = 0; offset < days; offset += 1) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
      if (date.getMonth() + 1 === month && date.getDate() === day) return true;
    }
    return false;
  });
}

export type PermissionRow = {
  resource: string;
  aluno: string;
  responsavel: string;
  funcionario: string;
  admin: string;
};

export const permissionMatrix: PermissionRow[] = [
  { resource: "Feed e murais", aluno: "Ler e publicar", responsavel: "Somente leitura", funcionario: "Ler, publicar e moderar", admin: "Ler, publicar e moderar" },
  { resource: "Grupos de estudo", aluno: "Participar", responsavel: "Sem acesso", funcionario: "Criar e acompanhar", admin: "Criar e acompanhar" },
  { resource: "Chat direto", aluno: "Professores e colegas", responsavel: "Professores e coordenação", funcionario: "Todos os perfis", admin: "Todos os perfis" },
  { resource: "Notas e boletim", aluno: "Somente o próprio", responsavel: "Somente filhos vinculados", funcionario: "Turmas que leciona", admin: "Todos" },
  { resource: "Comunicados", aluno: "Ler", responsavel: "Ler", funcionario: "Ler e publicar", admin: "Ler e publicar" },
  { resource: "Cadastros e vínculos", aluno: "Sem acesso", responsavel: "Sem acesso", funcionario: "Sem acesso", admin: "Gerenciar" },
  { resource: "Dados restritos de outros alunos", aluno: "Bloqueado", responsavel: "Bloqueado", funcionario: "Somente suas turmas", admin: "Acesso total" },
];

export type StaffLesson = { time: string; className: string; subject: string; room: string };

export const staffLessonsToday: StaffLesson[] = [
  { time: "07:00 - 07:50", className: "8º Ano A", subject: "Coordenação / Projeto", room: "Sala 12" },
  { time: "07:50 - 08:40", className: "7º Ano B", subject: "Projeto de Leitura", room: "Sala 08" },
  { time: "08:40 - 09:30", className: "9º Ano A", subject: "Orientação de estudos", room: "Sala 15" },
  { time: "09:50 - 10:40", className: "6º Ano A", subject: "Projeto de Leitura", room: "Sala 05" },
  { time: "10:40 - 11:30", className: "8º Ano A", subject: "Orientação de estudos", room: "Sala 12" },
  { time: "13:30 - 14:20", className: "7º Ano B", subject: "Coordenação / Projeto", room: "Sala 08" },
];

export const profileDefaults: Record<AreaRole, ProfileData> = {
  aluno: {
    name: "Rafael da Silva Moura",
    email: "rafael@cepi.com",
    phone: "(81) 98888-0011",
    bio: "Gosto de ciências, música e de estudar em grupo.",
    interests: "Música, Tecnologia",
    photo: "",
  },
  responsavel: {
    name: "Fabricya Nayanne Santos",
    email: "fabricya@cepi.com",
    phone: "(81) 99999-0001",
    bio: "Mãe de Rafael, aluno do 8º Ano A.",
    interests: "",
    photo: "",
  },
  funcionario: {
    name: "Luan Santana Souza",
    email: "luan@cepi.com",
    phone: "(81) 97777-0001",
    bio: "Professor de Matemática do Ensino Fundamental II.",
    interests: "Matemática, Projetos escolares",
    photo: "",
  },
  direcao: {
    name: "Fabricya Nayanne Santos",
    email: "fabricya.direcao@cepi.com",
    phone: "(81) 96666-0001",
    bio: "Direção e coordenação do Colégio CEPI Expansão.",
    interests: "",
    photo: "",
  },
  admin: {
    name: "Igor Gabriel",
    email: "igor@cepi.com",
    phone: "(81) 95555-0001",
    bio: "TI · segurança e controle de acessos do sistema.",
    interests: "",
    photo: "",
  },
};

export type ProfileData = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  interests: string;
  photo: string;
};

export const PROFILE_KEY_PREFIX = "zenix-profile-";

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
