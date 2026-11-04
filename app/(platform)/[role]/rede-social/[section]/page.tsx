import SocialNetwork from "@/components/shared/social-network";
import type { SocialRole } from "@/data/social";

const roles = new Set<SocialRole>(["aluno", "responsavel", "funcionario"]);
export default async function SocialRoute({
  params,
}: {
  params: Promise<{ role: string; section: string }>;
}) {
  const { role, section } = await params;
  const safeRole = roles.has(role as SocialRole)
    ? (role as SocialRole)
    : "aluno";
  return <SocialNetwork role={safeRole} initialSection={section} />;
}
