"use client";

import { useState } from "react";
import { useSessionIn } from "@/lib/demo-session";
import { ArrowLeft, Bell, Search, Users } from "lucide-react";
import { mockClasses, mockNotifications, mockPosts, type Attachment, type SocialRole } from "@/data/shared/social";
import { studyGroupCatalog } from "@/data/shared/rede-social";
import { Chat } from "@/components/social/chat/chat";
import { StudyGroupsView } from "@/components/social/groups/group-components";
import { initialMuralPosts, initialMurals, MuralView } from "@/components/social/murais/mural-view";
import { ProfileView } from "@/components/social/perfil/profile-view";
import { PostCard, PostComposer } from "@/components/social/feed/feed-components";
import { Avatar, Badge } from "@/components/social/shared/social-ui";
import { VideoModal } from "@/components/social/videos/video-components";
import { CEPI_LOGO, feedSeed, feedSeedCoordenacao, feedSeedResponsavel, socialIdentity, socialNav, type LibraryVideo } from "@/data/shared/rede-social";
import { NavIcon } from "@/components/rede-social/ui";
import { MuraisBoard } from "@/components/rede-social/murais-board";
import { StudentVideos, TeacherVideos } from "@/components/rede-social/video-views";
import { HobbiesView } from "@/components/social/hobbies/hobby-components";
import { useSocialStore } from "@/components/rede-social/store";
import { ChildrenView, CoordClassesView, CoordNoticesView, DoubtsView, ModerationView, NoticesView, ReportsView, TeacherClassesView } from "@/components/rede-social/role-views";

const logo = CEPI_LOGO;
const profileLabels = { aluno: socialIdentity.aluno.name, responsavel: socialIdentity.responsavel.name, funcionario: socialIdentity.funcionario.name, coordenacao: socialIdentity.coordenacao.name };
const allowed: Record<SocialRole, { key: string; label: string; icon: string }[]> = socialNav;

function PageIntro({ title, text }: { title: string; text: string }) { return <div className="social-heading"><Badge>Rede Social Escolar</Badge><h1>{title}</h1><p>{text}</p></div>; }

export default function SocialNetwork({ role = "aluno", initialSection = "feed", sessions, onBack }: { role?: SocialRole; initialSection?: string; sessions?: string[]; onBack?: () => void }) {
  const authorized = useSessionIn(sessions ?? [role]);
  const [requestedSection, setSection] = useState(initialSection);
  const store = useSocialStore();
  const [posts, setPosts] = useState(() => [...(role === "coordenacao" ? feedSeedCoordenacao : role === "responsavel" ? feedSeedResponsavel : feedSeed), ...mockPosts]);
  const [murals, setMurals] = useState(initialMurals);
  const [postsByMural, setPostsByMural] = useState(initialMuralPosts);
  const [ownPostIdsByMural, setOwnPostIdsByMural] = useState<Record<string, number[]>>({});
  const [studyGroups, setStudyGroups] = useState(studyGroupCatalog);
  const [groupPosts, setGroupPosts] = useState<Record<number, (typeof mockPosts)[number][]>>({});
  const [ownPostIdsByGroup, setOwnPostIdsByGroup] = useState<Record<number, number[]>>({});
  const [likedPostIdsByGroup, setLikedPostIdsByGroup] = useState<Record<number, number[]>>({});
  const [commentsByGroup, setCommentsByGroup] = useState<Record<number, Record<number, string[]>>>({});
  const [newMuralTitle, setNewMuralTitle] = useState("");
  const [newMuralDescription, setNewMuralDescription] = useState("");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [ownPostIds, setOwnPostIds] = useState<number[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<number, string[]>>({});
  const [video, setVideo] = useState<LibraryVideo | null>(null);
  const [watchedVideoIds, setWatchedVideoIds] = useState<number[]>([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<number[]>([1]);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState<number[]>([]);
  const nav = allowed[role];
  // Só abre seções permitidas ao perfil; qualquer outra URL cai na primeira seção do menu.
  const section = nav.some((item) => item.key === requestedSection) || (requestedSection === "publicar" && role !== "responsavel") ? requestedSection : nav[0].key;
  const current = nav.find((item) => item.key === section) ?? nav[0];
  const profile = profileLabels[role];
  const publish = (text: string, attachments?: Attachment[], image?: string) => { const id = Date.now(); setOwnPostIds((currentIds) => [...currentIds, id]); setPosts((currentPosts) => [{ ...mockPosts[0], id, name: profile, profile: role === "aluno" ? "Aluno" : role === "coordenacao" ? "Coordenação" : "Professora", initials: socialIdentity[role].initials, color: role === "aluno" ? "blue" : "purple", date: "Agora", text, likes: 0, comments: 0, image, attachments }, ...currentPosts]); };
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
  const toggleJoin = (groupId: number) => {
    const joined = joinedGroupIds.includes(groupId);
    setJoinedGroupIds((current) => joined ? current.filter((id) => id !== groupId) : [...current, groupId]);
    setStudyGroups((current) => current.map((group) => {
      if (group.id !== groupId) return group;
      const total = Math.max(0, (parseInt(group.members, 10) || 0) + (joined ? -1 : 1));
      return { ...group, members: `${total} ${total === 1 ? "participante" : "participantes"}` };
    }));
  };
  const like = (postId: number) => { const liked = likedPosts.includes(postId); setLikedPosts((currentIds) => liked ? currentIds.filter((id) => id !== postId) : [...currentIds, postId]); setPosts((currentPosts) => currentPosts.map((post) => post.id === postId ? { ...post, likes: post.likes + (liked ? -1 : 1) } : post)); };
  const comment = (postId: number, text: string) => { setCommentsByPost((current) => ({ ...current, [postId]: [...(current[postId] ?? []), text] })); setPosts((currentPosts) => currentPosts.map((post) => post.id === postId ? { ...post, comments: post.comments + 1 } : post)); };
  const term = query.trim().toLowerCase();
  const visiblePosts = term ? posts.filter((post) => `${post.text} ${post.name} ${post.profile}`.toLowerCase().includes(term)) : posts;
  const notifications = mockNotifications[role];
  const unread = notifications.filter((item) => !notifRead.includes(item.id)).length;
  const feed = <>
  <div className="social-heading">
    <div>
      <Badge>Comunidade escolar</Badge>
      <h1>Olá, {profile.split(" ")[0]}!</h1>
      <p>Acompanhe as novidades da sua comunidade.</p>
    </div>
  </div>
  {(role === "aluno" || role === "funcionario" || role === "coordenacao") && <PostComposer role={role} onPublish={publish} />}
  <div className="feed-list">
    {
    visiblePosts.length === 0 ? <p className="zx-empty">Nenhuma publicação encontrada para "{query}".</p> : visiblePosts.map(
      (post) => <PostCard key={post.id} post={post} liked={likedPosts.includes(post.id)}
      onLike={() => like(post.id)} 
      onComment={(text) => comment(post.id, text)} comments={commentsByPost[post.id] ?? []} isOwn={ownPostIds.includes(post.id)} 
      onEdit={(text) => setPosts((currentPosts) => currentPosts.map((item) => item.id === post.id ? { ...item, text } : item))} 
      onDelete={() => setPosts((currentPosts) => currentPosts.filter((item) => item.id !== post.id))} />)
    }
 </div>
  </>;
  
  let content: React.ReactNode = feed;
  if (section === "murais") content = <MuraisBoard role={role} notes={store.notes} setNotes={store.setNotes} />;
  if (section === "video-aulas") content = role === "funcionario" ? <TeacherVideos onOpen={setVideo} /> : <StudentVideos watchedIds={watchedVideoIds} onOpen={setVideo} />;
  if (section === "grupos") content = <StudyGroupsView role={role} joinedIds={joinedGroupIds} onToggleJoin={toggleJoin} groups={studyGroups} setGroups={setStudyGroups} groupPosts={groupPosts} setGroupPosts={setGroupPosts} ownPostIdsByGroup={ownPostIdsByGroup} setOwnPostIdsByGroup={setOwnPostIdsByGroup} likedPostIdsByGroup={likedPostIdsByGroup} setLikedPostIdsByGroup={setLikedPostIdsByGroup} commentsByGroup={commentsByGroup} setCommentsByGroup={setCommentsByGroup} />;
  if (section === "hobbies") content = <HobbiesView />;
  if (section === "filhos") content = <ChildrenView />;
  if (section === "comunicados") content = role === "coordenacao" ? <CoordNoticesView store={store} /> : <NoticesView store={store} />;
  if (section === "duvidas") content = <DoubtsView store={store} />;
  if (section === "moderacao") content = <ModerationView store={store} />;
  if (section === "relatorios") content = <ReportsView store={store} />;
  if (section === "chat") content = <Chat role={role} />;
  if (section === "perfil") content = <ProfileView role={role} posts={posts} ownPostIds={ownPostIds} likedPosts={likedPosts} groups={studyGroups} joinedIds={joinedGroupIds} />;
  if (section === "publicar") content = <><PageIntro title="Criar mural" text="Crie um espaço para compartilhar comunicados e novidades com a comunidade escolar." /><form className="social-card publish-form" onSubmit={createMural}><label htmlFor="mural-title">Nome do mural</label><input id="mural-title" value={newMuralTitle} onChange={(event) => setNewMuralTitle(event.target.value)} placeholder="Ex.: Feira de Ciências" required /><label htmlFor="mural-description">Descrição</label><textarea id="mural-description" value={newMuralDescription} onChange={(event) => setNewMuralDescription(event.target.value)} placeholder="Descreva o objetivo deste mural..." required /><button className="primary-button" type="submit">Criar mural</button></form></>;
  if (section === "turmas") content = role === "coordenacao" ? <CoordClassesView /> : role === "funcionario" ? <TeacherClassesView store={store} /> : <><PageIntro title="Turmas" text="Gerencie as turmas e acompanhe a comunidade de cada sala." /><div className="classes-table">{mockClasses.map((item) => <div className="class-row" key={item.id}><div className="group-icon blue"><Users /></div><div><b>{item.name}</b><small>{item.subject} · {item.room}</small></div><Badge>{item.students} alunos</Badge></div>)}</div></>;

  if (!authorized) return null;

  const identity = socialIdentity[role];
  return <div className="social-shell rs-shell"><aside className="social-nav rs-side"><div className="rs-brand"><img src={logo} alt="CEPI Expansão" /><div><b>CEPI Expansão</b><small>Rede Social Escolar</small></div></div><span className={`rs-role-pill role-${role}`}>{identity.badge}</span><nav>{nav.map((item) => <button className={section === item.key ? "active" : ""} key={item.key} onClick={() => setSection(item.key)}><NavIcon name={item.icon} />{item.label}</button>)}</nav><button className="back-platform" onClick={() => window.history.back()}><ArrowLeft size={15} /> Voltar à plataforma</button><div className="social-user"><Avatar initials={identity.initials} color="green" /><span><b>{profile}</b><small>{identity.subtitle.split(" · ")[0]}</small></span></div></aside><main className="social-main"><header className="social-header"><div><b>{current.label}</b><small>{identity.subtitle}</small></div><div className="social-header-actions"><label className="social-search"><Search /><input value={query} onChange={(event) => { setQuery(event.target.value); if (section !== "feed") setSection("feed"); }} placeholder="Buscar publicações" aria-label="Buscar publicações" />{query && <button type="button" aria-label="Limpar busca" onClick={() => setQuery("")}>×</button>}</label><div className="notif-wrap"><button type="button" className="notif-button" aria-label="Notificações" aria-expanded={notifOpen} onClick={() => setNotifOpen((open) => !open)}><Bell />{unread > 0 && <i>{unread}</i>}</button>{notifOpen && <div className="notif-pop" role="menu">{notifications.map((item) => <button type="button" role="menuitem" className={notifRead.includes(item.id) ? "read" : ""} key={item.id} onClick={() => { setNotifRead((current) => current.includes(item.id) ? current : [...current, item.id]); if (nav.some((entry) => entry.key === item.section)) setSection(item.section); setNotifOpen(false); }}>{item.text}</button>)}<button type="button" className="notif-all" onClick={() => setNotifRead(notifications.map((item) => item.id))}>Marcar todas como lidas</button></div>}</div><Avatar initials={identity.initials} color="green" /></div></header><div className="social-content">{content}</div></main>{video && <VideoModal video={video as never} watched={watchedVideoIds.includes(video.id)} onComplete={() => setWatchedVideoIds((current) => current.includes(video.id) ? current : [...current, video.id])} onClose={() => setVideo(null)} />}</div>;
}
