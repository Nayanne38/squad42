"use client";

import { useState } from "react";
import { ArrowLeft, Bell, BookOpen, Home, MessageCircle, Search, Settings, Sparkles, Users, Video } from "lucide-react";
import { mockClasses, mockGroups, mockHobbies, mockPosts, mockVideos, type SocialRole } from "@/data/shared/social";
import { Chat } from "@/components/social/chat/chat";
import { StudyGroupsView } from "@/components/social/groups/group-components";
import { HobbyCard } from "@/components/social/hobbies/hobby-components";
import { initialMuralPosts, initialMurals, MuralView } from "@/components/social/murais/mural-view";
import { ProfileView } from "@/components/social/perfil/profile-view";
import { PostCard, PostComposer } from "@/components/social/feed/feed-components";
import { Avatar, Badge } from "@/components/social/shared/social-ui";
import { VideoCard, VideoModal } from "@/components/social/videos/video-components";

const logo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7Ezo2vTuYX5AbUDY3GNV6xgjvUfGqs.png";
const profileLabels = { aluno: "Aluno Modelo 101", responsavel: "Responsável Modelo", funcionario: "Fernanda Lima" };
const allowed: Record<SocialRole, { key: string; label: string; icon: typeof Home }[]> = {
  aluno: [{ key: "feed", label: "Feed", icon: Home }, { key: "murais", label: "Murais", icon: BookOpen }, { key: "video-aulas", label: "Vídeo-aulas", icon: Video }, { key: "grupos", label: "Grupos de estudos", icon: Users }, { key: "hobbies", label: "Hobbies", icon: Sparkles }, { key: "chat", label: "Chat direto", icon: MessageCircle }, { key: "perfil", label: "Meu perfil", icon: Settings }],
  responsavel: [{ key: "feed", label: "Feed", icon: Home }, { key: "murais", label: "Murais", icon: BookOpen }, { key: "video-aulas", label: "Vídeo-aulas", icon: Video }, { key: "chat", label: "Chat direto", icon: MessageCircle }, { key: "perfil", label: "Meu perfil", icon: Settings }],
  funcionario: [{ key: "feed", label: "Feed", icon: Home }, { key: "murais", label: "Murais", icon: BookOpen }, { key: "grupos", label: "Grupos de estudos", icon: Users }, { key: "chat", label: "Chat direto", icon: MessageCircle }, { key: "perfil", label: "Meu perfil", icon: Settings }, { key: "turmas", label: "Turmas", icon: Users }],
};

function PageIntro({ title, text }: { title: string; text: string }) { return <div className="social-heading"><Badge>Rede Social Escolar</Badge><h1>{title}</h1><p>{text}</p></div>; }

export default function SocialNetwork({ role = "aluno", initialSection = "feed", onBack }: { role?: SocialRole; initialSection?: string; onBack?: () => void }) {
  const [section, setSection] = useState(initialSection);
  const [posts, setPosts] = useState(mockPosts);
  const [murals, setMurals] = useState(initialMurals);
  const [postsByMural, setPostsByMural] = useState(initialMuralPosts);
  const [ownPostIdsByMural, setOwnPostIdsByMural] = useState<Record<string, number[]>>({});
  const [studyGroups, setStudyGroups] = useState(mockGroups);
  const [groupPosts, setGroupPosts] = useState<Record<number, (typeof mockPosts)[number][]>>({});
  const [ownPostIdsByGroup, setOwnPostIdsByGroup] = useState<Record<number, number[]>>({});
  const [likedPostIdsByGroup, setLikedPostIdsByGroup] = useState<Record<number, number[]>>({});
  const [commentsByGroup, setCommentsByGroup] = useState<Record<number, Record<number, string[]>>>({});
  const [newMuralTitle, setNewMuralTitle] = useState("");
  const [newMuralDescription, setNewMuralDescription] = useState("");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [ownPostIds, setOwnPostIds] = useState<number[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<number, string[]>>({});
  const [video, setVideo] = useState<(typeof mockVideos)[number] | null>(null);
  const nav = allowed[role];
  const current = nav.find((item) => item.key === section) ?? nav[0];
  const profile = profileLabels[role];
  const publish = (text: string) => { const id = Date.now(); setOwnPostIds((currentIds) => [...currentIds, id]); setPosts((currentPosts) => [{ ...mockPosts[0], id, name: profile, profile: role === "aluno" ? "Aluno" : "Professora", initials: role === "aluno" ? "AM" : "FL", color: role === "aluno" ? "blue" : "purple", date: "Agora", text, likes: 0, comments: 0, image: undefined }, ...currentPosts]); };
  const createMural = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newMuralTitle.trim();
    const description = newMuralDescription.trim();
    if (!title || !description) return;

    const key = `mural-${Date.now()}-${murals.length}`;
    setMurals((currentMurals) => [...currentMurals, { key, title, text: description }]);
    setPostsByMural((currentPosts) => ({ ...currentPosts, [key]: [] }));
    setNewMuralTitle("");
    setNewMuralDescription("");
    setSection("murais");
  };
  const like = (postId: number) => { const liked = likedPosts.includes(postId); setLikedPosts((currentIds) => liked ? currentIds.filter((id) => id !== postId) : [...currentIds, postId]); setPosts((currentPosts) => currentPosts.map((post) => post.id === postId ? { ...post, likes: post.likes + (liked ? -1 : 1) } : post)); };
  const comment = (postId: number, text: string) => { setCommentsByPost((current) => ({ ...current, [postId]: [...(current[postId] ?? []), text] })); setPosts((currentPosts) => currentPosts.map((post) => post.id === postId ? { ...post, comments: post.comments + 1 } : post)); };
  const feed = <>
  <div className="social-heading">
    <div>
      <Badge>Comunidade escolar</Badge>
      <h1>Olá, {profile.split(" ")[0]}!</h1>
      <p>Acompanhe as novidades da sua comunidade.</p>
    </div>
  </div>
  {(role === "aluno" || role === "funcionario") && <PostComposer role={role} onPublish={publish} />}
  <div className="feed-list">
    {
    posts.map(
      (post) => <PostCard key={post.id} post={post} liked={likedPosts.includes(post.id)}
      onLike={() => like(post.id)} 
      onComment={(text) => comment(post.id, text)} comments={commentsByPost[post.id] ?? []} isOwn={ownPostIds.includes(post.id)} 
      onEdit={(text) => setPosts((currentPosts) => currentPosts.map((item) => item.id === post.id ? { ...item, text } : item))} 
      onDelete={() => setPosts((currentPosts) => currentPosts.filter((item) => item.id !== post.id))} />)
    }
 </div>
  </>;
  
  let content: React.ReactNode = feed;
  if (section === "murais") content = <MuralView role={role} murals={murals} postsByMural={postsByMural} setPostsByMural={setPostsByMural} ownPostIdsByMural={ownPostIdsByMural} setOwnPostIdsByMural={setOwnPostIdsByMural} onNavigateToCreateMural={() => setSection("publicar")} />;
  if (section === "video-aulas") content = <><PageIntro title="Vídeo-aulas" text="Aprenda no seu ritmo com os conteúdos dos seus professores." /><div className="video-grid">{mockVideos.map((item) => <VideoCard key={item.id} video={item} onOpen={setVideo} />)}</div></>;
  if (section === "grupos") content = <StudyGroupsView role={role} groups={studyGroups} setGroups={setStudyGroups} groupPosts={groupPosts} setGroupPosts={setGroupPosts} ownPostIdsByGroup={ownPostIdsByGroup} setOwnPostIdsByGroup={setOwnPostIdsByGroup} likedPostIdsByGroup={likedPostIdsByGroup} setLikedPostIdsByGroup={setLikedPostIdsByGroup} commentsByGroup={commentsByGroup} setCommentsByGroup={setCommentsByGroup} />;
  if (section === "hobbies") content = <><PageIntro title="Hobbies" text="Descubra interesses em comum com a comunidade escolar." /><div className="hobbies-grid">{mockHobbies.map((hobby) => <HobbyCard key={hobby.id} hobby={hobby} />)}</div></>;
  if (section === "chat") content = <Chat />;
  if (section === "perfil") content = <ProfileView role={role} posts={posts} ownPostIds={ownPostIds} likedPosts={likedPosts} />;
  if (section === "publicar") content = <><PageIntro title="Criar mural" text="Crie um espaço para compartilhar comunicados e novidades com a comunidade escolar." /><form className="social-card publish-form" onSubmit={createMural}><label htmlFor="mural-title">Nome do mural</label><input id="mural-title" value={newMuralTitle} onChange={(event) => setNewMuralTitle(event.target.value)} placeholder="Ex.: Feira de Ciências" required /><label htmlFor="mural-description">Descrição</label><textarea id="mural-description" value={newMuralDescription} onChange={(event) => setNewMuralDescription(event.target.value)} placeholder="Descreva o objetivo deste mural..." required /><button className="primary-button" type="submit">Criar mural</button></form></>;
  if (section === "turmas") content = <><PageIntro title="Turmas" text="Gerencie as turmas e acompanhe a comunidade de cada sala." /><div className="classes-table">{mockClasses.map((item) => <div className="class-row" key={item.id}><div className="group-icon blue"><Users /></div><div><b>{item.name}</b><small>{item.subject} · {item.room}</small></div><Badge>{item.students} alunos</Badge></div>)}</div></>;

  return <div className="social-shell"><aside className="social-nav"><div className="social-brand"><img src={logo} alt="CEPI" /><div><b>ZENIX EDUCATION</b><small>Rede Social Escolar</small></div></div><button className="back-platform" onClick={onBack}><ArrowLeft /> Voltar à plataforma</button><nav>{nav.map((item) => { const Icon = item.icon; return <button className={section === item.key ? "active" : ""} key={item.key} onClick={() => setSection(item.key)}><Icon />{item.label}</button>; })}</nav><div className="social-user"><Avatar initials={role === "funcionario" ? "FL" : "AM"} color="green" /><span><b>{profile}</b><small>Perfil conectado</small></span></div></aside><main className="social-main"><header className="social-header"><div><b>Rede Social Escolar</b><small>Conecte-se, compartilhe e aprenda</small></div><div className="social-header-actions"><Search /><Bell /><Avatar initials={role === "funcionario" ? "FL" : "AM"} color="green" /></div></header><div className="social-content">{content}</div></main>{video && <VideoModal video={video} onClose={() => setVideo(null)} />}</div>;
}
