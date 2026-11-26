import SocialNetwork from "@/components/shared/social-network";
import type { SocialRole } from "@/data/shared/social";

const roles = new Set<SocialRole>(["aluno", "responsavel", "funcionario"]);
// O administrador usa a rede social com as permissões de funcionário.
export default async function SocialRoute({
  params,
}: {
  params: Promise<{ role: string; section: string }>;
}) {
  const { role, section } = await params;
  const safeRole = roles.has(role as SocialRole)
    ? (role as SocialRole)
    : role === "admin"
      ? "coordenacao"
      : "aluno";
  // Sessões que podem abrir esta rota: cada perfil só entra na própria área.
  const sessions =
    role === "admin"
      ? ["admin"]
      : safeRole === "funcionario"
        ? ["funcionario", "admin"]
        : [safeRole];
  return <SocialNetwork role={safeRole} initialSection={section} sessions={sessions} />;
}
