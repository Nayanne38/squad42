import { Pencil } from "lucide-react";
import { mockPosts, type SocialRole } from "@/data/shared/social";
import { Avatar } from "@/components/social/shared/social-ui";
import { PostCard } from "@/components/social/feed/feed-components";

export function ProfileView({ role, posts }: { role: SocialRole; posts: typeof mockPosts }) {
  const profileLabels = { aluno: "Aluno Modelo 101", responsavel: "Responsável Modelo", funcionario: "Fernanda Lima" };
  return <><div className="social-heading"><span className="social-badge">Rede Social Escolar</span><h1>Meu perfil</h1><p>Veja suas publicações e grupos de estudo.</p></div><div className="profile-hero social-card"><Avatar initials={role === "funcionario" ? "FL" : "AM"} color="blue" /><div><h2>{profileLabels[role]}</h2><p>{role === "aluno" ? "Aluno · 8º Ano A" : role === "responsavel" ? "Responsável de Aluno Modelo 101" : "Coordenação Pedagógica"}</p></div><button className="outline-button"><Pencil /> Editar perfil</button></div><div className="profile-tabs"><button className="active">Publicações</button><button>Grupos de estudo</button><button>Turmas</button></div><div className="feed-list">{posts.slice(0, 2).map((post) => <PostCard key={post.id} post={post} liked={false} onLike={() => {}} onComment={() => {}} comments={[]} isOwn={false} onEdit={() => {}} onDelete={() => {}} />)}</div></>;
}
