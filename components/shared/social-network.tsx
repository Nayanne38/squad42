"use client";

import { sessionOfSocial, useDemoUser } from "@/lib/demo-session";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionIn } from "@/lib/demo-session";
import { Bell, LogOut, Search, Users } from "lucide-react";
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
import { Bar, NavIcon } from "@/components/rede-social/ui";
import { achievements, weekDeadlines } from "@/data/shared/rede-social";
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
  const router = useRouter();
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
  const demoUser = useDemoUser(sessionOfSocial(role));
  const profile = demoUser.name;
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
  const greeting = role === "coordenacao" ? "Feed da escola" : role === "funcionario" ? `Bom dia, professor ${demoUser.firstName}` : `Bom dia, ${demoUser.firstName}`;
  const feedSub = role === "coordenacao" ? "Publicações oficiais e da comunidade" : role === "responsavel" ? "Acompanhando seus filhos no mesmo login" : role === "funcionario" ? "Acompanhe a comunidade das suas turmas" : "Você tem 2 prazos esta semana";
  const feed = <div className="rs-feed-grid">
  <div className="rs-feed-main">
    <div className="rs-head"><div><h1>{greeting}</h1><p>{feedSub}</p></div>{role === "aluno" && <span className="rs-chip-yellow">Sequência de estudo: 7 dias</span>}</div>
    <label className="rs-feed-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar…" aria-label="Buscar publicações" />{query && <button type="button" aria-label="Limpar busca" onClick={() => setQuery("")}>×</button>}</label>
    {(role === "aluno" || role === "funcionario" || role === "coordenacao") && <PostComposer role={role} onPublish={publish} />}
    <div className="feed-list">
      {visiblePosts.length === 0 ? <p className="zx-empty">Nenhuma publicação encontrada para "{query}".</p> : visiblePosts.map(
        (post) => <PostCard key={post.id} post={post} liked={likedPosts.includes(post.id)}
        onLike={() => like(post.id)}
        onComment={(text) => comment(post.id, text)} comments={commentsByPost[post.id] ?? []} isOwn={ownPostIds.includes(post.id)}
        onEdit={(text) => setPosts((currentPosts) => currentPosts.map((item) => item.id === post.id ? { ...item, text } : item))}
        onDelete={() => setPosts((currentPosts) => currentPosts.filter((item) => item.id !== post.id))} />)}
    </div>
  </div>
  <aside className="rs-feed-aside">
    {role === "aluno" ? <>
      <div className="rs-aside-card"><h3>Desafios da semana</h3>{[["Entregar 2 atividades", 50, "green"], ["Ajudar um colega", 100, "indigo"], ["Assistir 3 vídeo aulas", 66, "gold"]].map(([label, value, tone]) => <div key={label as string} className="rs-challenge"><span>{label}</span><b>{value}%</b><Bar value={value as number} tone={tone as string} /></div>)}</div>
      <div className="rs-aside-card"><h3>Conquistas recentes</h3><div className="rs-medals">{achievements.slice(0, 3).map((item) => <span key={item.label}><i className={`medal ${item.color}`}>{item.letter}</i><small>{item.label.split(" ")[0]}</small></span>)}</div></div>
      <div className="rs-aside-card plain"><h3>Grupos ativos</h3><p>Matemática · 7º ano <small>3 novas</small></p><p>Revisão para provas <small>1 nova</small></p></div>
    </> : role === "responsavel" ? <>
      <div className="rs-aside-card plain"><h3>Agenda de reuniões</h3><p><b>Ter 18h30</b> · Reunião de pais</p><p><b>Qui 14h</b> · Atendimento Prof. Carlos</p></div>
      <div className="rs-aside-card indigo"><h3>Fale com a escola</h3><p>Dentro da escola o celular é restrito. Use o chat e receba a resposta aqui.</p><button type="button" className="rs-primary" onClick={() => setSection("chat")}>Nova mensagem</button></div>
    </> : <div className="rs-aside-card mint"><h3>Prazos da semana</h3>{weekDeadlines.map((item) => <p key={item.subject}><b>{item.subject}</b> · {item.detail}</p>)}<a href="#murais" onClick={(event) => { event.preventDefault(); setSection("murais"); }}>Ver murais →</a></div>}
  </aside>
  </div>;

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

  const identity = { ...socialIdentity[role], name: demoUser.name, firstName: demoUser.firstName, initials: demoUser.initials };
  const mainNav = nav.filter((item) => item.key !== "perfil");
  const leave = () => { try { sessionStorage.removeItem("zenix-demo-session"); } catch {} router.push("/"); };
  return <div className={`social-shell rs-shell rs-theme-${role}`}><aside className="social-nav rs-side"><img className="rs-logo" src={logo} alt="Colégio CEPI Expansão" /><span className="rs-role-pill">{identity.badge}</span><nav>{mainNav.map((item) => <button className={section === item.key ? "active" : ""} key={item.key} onClick={() => setSection(item.key)}><NavIcon name={item.icon} />{item.label}</button>)}</nav><div className="rs-side-bottom"><button className={section === "perfil" ? "active" : ""} onClick={() => setSection("perfil")}><NavIcon name="profile" />Perfil</button><button className="rs-leave" onClick={leave}><LogOut size={16} />Sair</button></div></aside><main className="social-main"><div className="rs-top-actions"><div className="notif-wrap"><button type="button" className="notif-button" aria-label="Notificações" aria-expanded={notifOpen} onClick={() => setNotifOpen((open) => !open)}><Bell />{unread > 0 && <i>{unread}</i>}</button>{notifOpen && <div className="notif-pop" role="menu">{notifications.map((item) => <button type="button" role="menuitem" className={notifRead.includes(item.id) ? "read" : ""} key={item.id} onClick={() => { setNotifRead((current) => current.includes(item.id) ? current : [...current, item.id]); if (nav.some((entry) => entry.key === item.section)) setSection(item.section); setNotifOpen(false); }}>{item.text}</button>)}<button type="button" className="notif-all" onClick={() => setNotifRead(notifications.map((item) => item.id))}>Marcar todas como lidas</button></div>}</div></div><div className="social-content">{content}</div></main>{video && <VideoModal video={video as never} watched={watchedVideoIds.includes(video.id)} onComplete={() => setWatchedVideoIds((current) => current.includes(video.id) ? current : [...current, video.id])} onClose={() => setVideo(null)} />}</div>;
}
