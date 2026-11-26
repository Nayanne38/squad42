import { ArrowRight, MessageCircle } from "lucide-react";

const copy = {
  aluno: "Feed, murais, vídeo aulas, grupos de estudo e mensagens com a sua turma.",
  responsavel: "Comunicados, murais e mensagens com professores e coordenação.",
  funcionario: "Publique nos murais, responda dúvidas e fale com alunos e responsáveis.",
  direcao: "Moderação, comunicados, turmas e relatórios da comunidade escolar.",
} as const;

export function SocialCta({ role }: { role: keyof typeof copy }) {
  return (
    <a className="social-cta" href={`/${role}/rede-social/feed`}>
      <span className="social-cta-icon">
        <MessageCircle size={28} />
      </span>
      <span className="social-cta-text">
        <small>Novidades da escola</small>
        <strong>Entrar na Rede Social Escolar</strong>
        <em>{copy[role]}</em>
      </span>
      <span className="social-cta-go">
        Acessar <ArrowRight size={18} />
      </span>
    </a>
  );
}
