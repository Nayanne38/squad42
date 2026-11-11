import { Pencil } from "lucide-react";
import { mockPosts, type SocialRole } from "@/data/shared/social";
import { Avatar } from "@/components/social/shared/social-ui";
import { PostCard } from "@/components/social/feed/feed-components";
import { PostCardProfile } from "@/components/social/feed/feed-components";

export function ProfileView({ role, posts, ownPostIds, likedPosts }: { role: SocialRole; posts: typeof mockPosts; ownPostIds: number[]; likedPosts: number[] }) {
  const profileLabels = { aluno: "Aluno Modelo 101", responsavel: "Responsável Modelo", funcionario: "Fernanda Lima" };
  const profilePosts = posts.filter((post) => post.name === profileLabels[role] || ownPostIds.includes(post.id));
  const lPosts = posts.filter((post) => post.name === profileLabels[role] || likedPosts.includes(post.id));
  return <>
  <div className="social-heading">
    <span className="social-badge">Rede Social Escolar</span>
    <h1>Meu perfil</h1>
    <p>Veja suas publicações e grupos de estudo.</p>
  </div>
  
  <div className="profile-hero social-card">
    <Avatar initials={role === "funcionario" ? "FL" : "AM"} color="blue" />
    <div>
      <h2>{profileLabels[role]}</h2>
      <p>{role === "aluno" ? "Aluno · 8º Ano A" : role === "responsavel" ? "Responsável de Aluno Modelo 101" : "Coordenação Pedagógica"}</p>
    </div>
    <button className="outline-button"><Pencil />Editar foto de perfil</button>
    {/*<input type="file" className="outline-button" accept="image/*" />*/}
  </div>
    
  <div className="profile-tabs">
    <button className="active">Publicações</button>
    <button>Grupos de estudo</button>
  </div>
  
  <div className="feed-list">{profilePosts.filter((p) => lPosts.includes(p)).map((post) => 
    <PostCardProfile key={post.id} post={post}  />)}
  </div>
</>;
}
