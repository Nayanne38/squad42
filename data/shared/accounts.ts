export type DemoAccount = {
  email: string;
  password: string;
  /** Valor gravado na sessão demonstrativa (define a área que abre). */
  session: "aluno" | "responsavel" | "funcionario" | "direcao" | "admin";
  name: string;
  firstName: string;
  initials: string;
  /** Função exibida no painel. */
  roleTitle: string;
  /** Texto do atalho na tela de login. */
  shortcut: string;
};

export const demoAccounts: DemoAccount[] = [
  { email: "rafael@cepi.com", password: "rafael123", session: "aluno", name: "Rafael da Silva Moura", firstName: "Rafael", initials: "RM", roleTitle: "Aluno · 8º Ano A", shortcut: "Rafael" },
  { email: "fabricya@cepi.com", password: "fabricya123", session: "responsavel", name: "Fabricya Nayanne Santos", firstName: "Fabricya", initials: "FN", roleTitle: "Responsável · mãe de Rafael", shortcut: "Fabricya" },
  { email: "luan@cepi.com", password: "luan123", session: "funcionario", name: "Luan Santana Souza", firstName: "Luan", initials: "LS", roleTitle: "Professor de Matemática", shortcut: "Luan · Matemática" },
  { email: "joao@cepi.com", password: "joao123", session: "funcionario", name: "João Vitor Braz Mourão", firstName: "João Vitor", initials: "JV", roleTitle: "Professor de Geografia", shortcut: "João Vitor · Geografia" },
  { email: "atabisio@cepi.com", password: "atabisio123", session: "funcionario", name: "Atabisio Henry", firstName: "Atabisio", initials: "AH", roleTitle: "Professor de Língua Portuguesa", shortcut: "Atabisio · Português" },
  { email: "fabricya.direcao@cepi.com", password: "fabricya123", session: "direcao", name: "Fabricya Nayanne Santos", firstName: "Fabricya", initials: "FN", roleTitle: "Diretora · Direção e Coordenação", shortcut: "Direção / Coordenação" },
  { email: "igor@cepi.com", password: "igor123", session: "admin", name: "Igor Gabriel", firstName: "Igor", initials: "IG", roleTitle: "TI · Segurança e acessos", shortcut: "Igor · Segurança" },
  { email: "yan@cepi.com", password: "yan123", session: "admin", name: "Yan Francisco Jesus de Oliveira", firstName: "Yan", initials: "YO", roleTitle: "TI · Infraestrutura e backup", shortcut: "Yan · Infraestrutura" },
  { email: "rafael.ti@cepi.com", password: "rafael123", session: "admin", name: "Rafael da Silva Moura", firstName: "Rafael", initials: "RM", roleTitle: "TI · Sistemas e cadastros", shortcut: "Rafael · Sistemas" },
];

export const USER_KEY = "zenix-demo-user";

/** Contas exibidas em cada tela de login. */
export const loginGroups: Record<string, DemoAccount["session"][]> = {
  aluno: ["aluno"],
  responsavel: ["responsavel"],
  funcionario: ["funcionario", "direcao"],
  admin: ["admin"],
};

export const defaultAccount = (session: DemoAccount["session"]) =>
  demoAccounts.find((item) => item.session === session) ?? demoAccounts[0];
