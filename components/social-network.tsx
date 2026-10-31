"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Heart,
  Home,
  ImagePlus,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";
import {
  mockClasses,
  mockContacts,
  mockGroups,
  mockHobbies,
  mockMessages,
  mockPosts,
  mockVideos,
  type SocialRole,
} from "@/data/social";

const logo =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7Ezo2vTuYX5AbUDY3GNV6xgjvUfGqs.png";
const profileLabels = {
  aluno: "Aluno Modelo 101",
  responsavel: "Responsável Modelo",
  funcionario: "Fernanda Lima",
};
const allowed: Record<SocialRole, { key: string; label: string; icon: any }[]> =
  {
    aluno: [
      { key: "feed", label: "Feed", icon: Home },
      { key: "murais", label: "Murais", icon: BookOpen },
      { key: "video-aulas", label: "Vídeo-aulas", icon: Video },
      { key: "grupos", label: "Grupos de estudos", icon: Users },
      { key: "hobbies", label: "Hobbies", icon: Sparkles },
      { key: "chat", label: "Chat direto", icon: MessageCircle },
      { key: "perfil", label: "Meu perfil", icon: Settings },
      { key: "publicar", label: "Publicar", icon: Plus },
    ],
    responsavel: [
      { key: "feed", label: "Feed", icon: Home },
      { key: "murais", label: "Murais", icon: BookOpen },
      { key: "video-aulas", label: "Vídeo-aulas", icon: Video },
      { key: "chat", label: "Chat direto", icon: MessageCircle },
      { key: "perfil", label: "Meu perfil", icon: Settings },
    ],
    funcionario: [
      { key: "feed", label: "Feed", icon: Home },
      { key: "murais", label: "Murais", icon: BookOpen },
      { key: "chat", label: "Chat direto", icon: MessageCircle },
      { key: "perfil", label: "Meu perfil", icon: Settings },
      { key: "publicar", label: "Publicar", icon: Plus },
      { key: "turmas", label: "Turmas", icon: Users },
    ],
  };

function Avatar({
  initials,
  color = "blue",
  online = false,
}: {
  initials: string;
  color?: string;
  online?: boolean;
}) {
  return (
    <span className={`social-avatar ${color}`}>
      {initials}
      {online && <i />}
    </span>
  );
}
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="social-badge">{children}</span>;
}
function PostCard({
  post,
  onLike,
  liked,
  onComment,
  comments,
  isOwn,
  onEdit,
  onDelete,
}: {
  post: (typeof mockPosts)[number];
  onLike: () => void;
  liked: boolean;
  onComment: (text: string) => void;
  comments: string[];
  isOwn: boolean;
  onEdit: (text: string) => void;
  onDelete: () => void;
}) {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.text);
  return (
    <article className="social-card post-card">
      <div className="post-head">
        <Avatar initials={post.initials} color={post.color} />
        <div>
          <b>{post.name}</b>
          <small>
            {post.profile} · {post.date}
          </small>
        </div>
        {isOwn && (
          <div className="post-owner-actions">
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label="Editar publicação"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="Excluir publicação"
            >
              Excluir
            </button>
          </div>
        )}
        <MoreHorizontal size={18} />
      </div>
      {editing ? (
        <form
          className="edit-post-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (draft.trim()) {
              onEdit(draft.trim());
              setEditing(false);
            }
          }}
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Editar publicação"
          />
          <div>
            <button
              type="button"
              onClick={() => {
                setDraft(post.text);
                setEditing(false);
              }}
            >
              Cancelar
            </button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      ) : (
        <p>{post.text}</p>
      )}
      {post.image && (
        <img
          className="post-image"
          src={post.image}
          alt="Registro de atividade escolar"
        />
      )}
      <div className="post-actions">
        <button
          className={liked ? "liked" : ""}
          onClick={onLike}
          aria-pressed={liked}
          aria-label={`${liked ? "Descurtir" : "Curtir"} publicação de ${post.name}`}
        >
          <Heart fill={liked ? "currentColor" : "none"} /> {post.likes}
        </button>
        <button
          type="button"
          onClick={() => setShowComments((value) => !value)}
          aria-expanded={showComments}
        >
          <MessageCircle /> {post.comments} comentários
        </button>
        <button className="post-more">Compartilhar</button>
      </div>
      {showComments && (
        <div className="comments-list">
          {comments.length ? (
            comments.map((item, index) => (
              <p key={`${post.id}-comment-${index}`}>
                <b>Comentário: </b>
                {item}
              </p>
            ))
          ) : (
            <small>Nenhum comentário ainda.</small>
          )}
        </div>
      )}
      <form
        className="comment-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!comment.trim()) return;
          onComment(comment.trim());
          setComment("");
          setShowComments(true);
        }}
      >
        <input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Adicione um comentário..."
          aria-label="Adicionar comentário"
        />
        <button type="submit" aria-label="Publicar comentário">
          <Send />
        </button>
      </form>
    </article>
  );
}
function PostComposer({
  role,
  onPublish,
}: {
  role: SocialRole;
  onPublish: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const currentName = profileLabels[role];
  const initials = role === "funcionario" ? "FL" : "AM";
  return (
    <div className="social-card composer">
      <div className="post-head">
        <Avatar
          initials={initials}
          color={role === "funcionario" ? "purple" : "blue"}
        />
        <div>
          <b>{currentName}</b>
          <small>Compartilhe algo com a comunidade</small>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="No que você está pensando?"
        aria-label="Texto da publicação"
      />
      <div className="composer-bottom">
        <button className="attach">
          <ImagePlus /> Adicionar imagem
        </button>
        <button
          className="primary-button"
          disabled={!text.trim()}
          onClick={() => {
            onPublish(text);
            setText("");
          }}
        >
          Publicar <Send />
        </button>
      </div>
    </div>
  );
}
function VideoCard({
  video,
  onOpen,
}: {
  video: (typeof mockVideos)[number];
  onOpen: (v: typeof video) => void;
}) {
  return (
    <button className="video-card" onClick={() => onOpen(video)}>
      <div className={`video-thumb ${video.color}`}>
        <span>{video.initials}</span>
        <Play fill="currentColor" />
        <small>
          <Clock3 /> {video.duration}
        </small>
      </div>
      <div className="video-info">
        <b>{video.title}</b>
        <small>{video.professor}</small>
        <span>
          Assistir aula <ChevronRight />
        </span>
      </div>
    </button>
  );
}
function VideoModal({
  video,
  onClose,
}: {
  video: (typeof mockVideos)[number];
  onClose: () => void;
}) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Vídeo aula"
    >
      <div className="video-modal">
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          <X />
        </button>
        {video.videoUrl ? (
          <video
            className="modal-video-player"
            controls
            autoPlay
            preload="metadata"
          >
            <source src={video.videoUrl} type="video/mp4" />
            Seu navegador não suporta a reprodução de vídeo.
          </video>
        ) : (
          <div className={`modal-video ${video.color}`}>
            <Play fill="white" />
          </div>
        )}
        <h2>{video.title}</h2>
        <p>
          {video.professor} · {video.duration}
        </p>
        {!video.videoUrl && (
          <button className="primary-button">
            Iniciar vídeo <Play fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  );
}
function GroupCard({ group }: { group: (typeof mockGroups)[number] }) {
  return (
    <button className="group-card">
      <div className={`group-icon ${group.color}`}>{group.icon}</div>
      <div>
        <b>{group.title}</b>
        <small>{group.subject}</small>
        <span>{group.members}</span>
      </div>
      <ChevronRight />
    </button>
  );
}
function Chat({ role }: { role: SocialRole }) {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(mockContacts[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [draft, setDraft] = useState("");
  const contacts = mockContacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="chat-layout">
      <aside className="chat-sidebar">
        <div className="section-heading">
          <h2>Chat direto</h2>
          <button aria-label="Nova conversa">
            <Plus />
          </button>
        </div>
        <div className="search-box">
          <Search />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar contatos"
            aria-label="Pesquisar contatos"
          />
        </div>
        {contacts.map((c) => (
          <button
            className={`contact ${active.id === c.id ? "active" : ""}`}
            key={c.id}
            onClick={() => setActive(c)}
          >
            <Avatar initials={c.initials} color={c.color} online={c.online} />
            <span>
              <b>{c.name}</b>
              <small>{c.profile}</small>
            </span>
            <ChevronRight />
          </button>
        ))}
      </aside>
      <section className="chat-window">
        <div className="chat-title">
          <Avatar
            initials={active.initials}
            color={active.color}
            online={active.online}
          />
          <div>
            <b>{active.name}</b>
            <small>{active.online ? "Online agora" : "Offline"}</small>
          </div>
        </div>
        <div className="messages">
          {messages
            .filter((m) => m.contactId === active.id)
            .map((m) => (
              <div className={`message ${m.mine ? "mine" : ""}`} key={m.id}>
                <span>{m.text}</span>
                <small>
                  {m.time}
                  {m.mine && <Check />}
                </small>
              </div>
            ))}
        </div>
        <form
          className="message-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            setMessages([
              ...messages,
              {
                id: Date.now(),
                contactId: active.id,
                text: draft,
                mine: true,
                time: "agora",
              },
            ]);
            setDraft("");
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escreva uma mensagem..."
            aria-label="Mensagem"
          />
          <button aria-label="Enviar mensagem">
            <Send />
          </button>
        </form>
      </section>
    </div>
  );
}

export default function SocialNetwork({
  role = "aluno",
  initialSection = "feed",
  onBack,
}: {
  role?: SocialRole;
  initialSection?: string;
  onBack?: () => void;
}) {
  const [section, setSection] = useState(initialSection);
  const [posts, setPosts] = useState(mockPosts);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [ownPostIds, setOwnPostIds] = useState<number[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<
    Record<number, string[]>
  >({});
  const [video, setVideo] = useState<(typeof mockVideos)[number] | null>(null);
  const nav = allowed[role];
  const current = nav.find((n) => n.key === section) ?? nav[0];
  const go = (key: string) => setSection(key);
  const title = current.label;
  const content = (() => {
    if (section === "feed")
      return (
        <>
          <div className="social-heading">
            <div>
              <Badge>Comunidade escolar</Badge>
              <h1>Olá, {profileLabels[role].split(" ")[0]}!</h1>
              <p>Acompanhe as novidades da sua comunidade.</p>
            </div>
          </div>
          {(role === "aluno" || role === "funcionario") && (
            <PostComposer
              role={role}
              onPublish={(text) => {
                const id = Date.now();
                setOwnPostIds((current) => [...current, id]);
                setPosts((currentPosts) => [
                  {
                    ...mockPosts[0],
                    id,
                    name: profileLabels[role],
                    profile: role === "aluno" ? "Aluno" : "Professora",
                    initials: role === "aluno" ? "AM" : "FL",
                    color: role === "aluno" ? "blue" : "purple",
                    date: "Agora",
                    text,
                    likes: 0,
                    comments: 0,
                    image: undefined,
                  },
                  ...currentPosts,
                ]);
              }}
            />
          )}
          <div className="feed-list">
            {posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                liked={likedPosts.includes(p.id)}
                onLike={() => {
                  const liked = likedPosts.includes(p.id);
                  setLikedPosts((current) =>
                    liked
                      ? current.filter((id) => id !== p.id)
                      : [...current, p.id],
                  );
                  setPosts((currentPosts) =>
                    currentPosts.map((item) =>
                      item.id === p.id
                        ? { ...item, likes: item.likes + (liked ? -1 : 1) }
                        : item,
                    ),
                  );
                }}
                onComment={(text) => {
                  setCommentsByPost((current) => ({
                    ...current,
                    [p.id]: [...(current[p.id] ?? []), text],
                  }));
                  setPosts((currentPosts) =>
                    currentPosts.map((item) =>
                      item.id === p.id
                        ? { ...item, comments: item.comments + 1 }
                        : item,
                    ),
                  );
                }}
                comments={commentsByPost[p.id] ?? []}
                isOwn={ownPostIds.includes(p.id)}
                onEdit={(text) =>
                  setPosts((currentPosts) =>
                    currentPosts.map((item) =>
                      item.id === p.id ? { ...item, text } : item,
                    ),
                  )
                }
                onDelete={() =>
                  setPosts((currentPosts) =>
                    currentPosts.filter((item) => item.id !== p.id),
                  )
                }
              />
            ))}
          </div>
        </>
      );
    if (section === "murais") return <MuralView role={role} />;
    if (section === "murais")
      return (
        <>
          <PageIntro
            title="Murais"
            text="Espaços para acompanhar os comunicados e momentos da escola."
          />
          <div className="notice-grid">
            {["Mural geral", "Avisos da turma", "Eventos da escola"].map(
              (x, i) => (
                <div className="social-card notice-board" key={x}>
                  <div
                    className={`board-icon ${["blue", "green", "purple"][i]}`}
                  >
                    <BookOpen />
                  </div>
                  <h3>{x}</h3>
                  <p>
                    {i === 0
                      ? "Comunicados importantes para toda a comunidade."
                      : "Novidades, registros e informações para você."}
                  </p>
                  <button>
                    Ver publicações <ChevronRight />
                  </button>
                </div>
              ),
            )}
          </div>
        </>
      );
    if (section === "video-aulas")
      return (
        <>
          <PageIntro
            title="Vídeo-aulas"
            text="Aprenda no seu ritmo com os conteúdos dos seus professores."
          />
          <div className="video-grid">
            {mockVideos.map((v) => (
              <VideoCard key={v.id} video={v} onOpen={setVideo} />
            ))}
          </div>
        </>
      );
    if (section === "grupos")
      return (
        <>
          <PageIntro
            title="Grupos de estudos"
            text="Encontre seus colegas e aprenda em conjunto."
          />
          <div className="groups-grid">
            {mockGroups.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        </>
      );
    if (section === "hobbies")
      return (
        <>
          <PageIntro
            title="Hobbies"
            text="Descubra interesses em comum com a comunidade escolar."
          />
          <div className="hobbies-grid">
            {mockHobbies.map((h) => (
              <div className={`social-card hobby-card ${h.color}`} key={h.id}>
                <span>{h.emoji}</span>
                <h3>{h.title}</h3>
                <p>{h.description}</p>
                <button>
                  Explorar <ChevronRight />
                </button>
              </div>
            ))}
          </div>
        </>
      );
    if (section === "chat") return <Chat role={role} />;
    if (section === "publicar")
      return (
        <>
          <PageIntro
            title="Publicar no mural"
            text="Compartilhe uma novidade com a comunidade escolar."
          />
          <div className="social-card publish-form">
            <label htmlFor="pub">O que você quer compartilhar?</label>
            <textarea id="pub" placeholder="Escreva sua publicação..." />
            <label htmlFor="board">Selecione um mural</label>
            <select id="board">
              <option>Mural geral</option>
              <option>Avisos da turma</option>
            </select>
            <button className="primary-button">
              Publicar <Send />
            </button>
          </div>
        </>
      );
    if (section === "turmas")
      return (
        <>
          <PageIntro
            title="Turmas"
            text="Gerencie as turmas e acompanhe a comunidade de cada sala."
          />
          <div className="classes-table">
            {mockClasses.map((c) => (
              <div className="class-row" key={c.id}>
                <div className="group-icon blue">
                  <Users />
                </div>
                <div>
                  <b>{c.name}</b>
                  <small>
                    {c.subject} · {c.room}
                  </small>
                </div>
                <Badge>{c.students} alunos</Badge>
                <ChevronRight />
              </div>
            ))}
          </div>
        </>
      );
    return (
      <>
        <PageIntro
          title="Meu perfil"
          text="Veja suas publicações e grupos de estudo."
        />
        <div className="profile-hero social-card">
          <Avatar
            initials={role === "funcionario" ? "FL" : "AM"}
            color="blue"
          />
          <div>
            <h2>{profileLabels[role]}</h2>
            <p>
              {role === "aluno"
                ? "Aluno · 8º Ano A"
                : role === "responsavel"
                  ? "Responsável de Aluno Modelo 101"
                  : "Coordenação Pedagógica"}
            </p>
          </div>
          <button className="outline-button">Editar perfil</button>
        </div>
        <div className="profile-tabs">
          <button className="active">Publicações</button>
          <button>Grupos de estudo</button>
          <button>Turmas</button>
        </div>
        <div className="feed-list">
          {posts.slice(0, 2).map((p) => (
            <PostCard key={p.id} post={p}/>
          ))}
        </div>
      </>
    );
  })();
  return (
    <div className="social-shell">
      <aside className="social-nav">
        <div className="social-brand">
          <img src={logo} alt="CEPI" />
          <div>
            <b>ZENIX EDUCATION</b>
            <small>Rede Social Escolar</small>
          </div>
        </div>
        <button className="back-platform" onClick={onBack}>
          <ArrowLeft /> Voltar à plataforma
        </button>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={section === item.key ? "active" : ""}
                key={item.key}
                onClick={() => go(item.key)}
              >
                <Icon />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="social-user">
          <Avatar
            initials={role === "funcionario" ? "FL" : "AM"}
            color="green"
          />
          <span>
            <b>{profileLabels[role]}</b>
            <small>Perfil conectado</small>
          </span>
        </div>
      </aside>
      <main className="social-main">
        <header className="social-header">
          <div>
            <b>Rede Social Escolar</b>
            <small>Conecte-se, compartilhe e aprenda</small>
          </div>
          <div className="social-header-actions">
            <Search />
            <Bell />
            <Avatar
              initials={role === "funcionario" ? "FL" : "AM"}
              color="green"
            />
          </div>
        </header>
        <div className="social-content">{content}</div>
      </main>
      {video && <VideoModal video={video} onClose={() => setVideo(null)} />}
    </div>
  );
}
const muralPosts = {
  geral: mockPosts.slice(0, 2),
  turma: mockPosts.slice(1, 3),
  eventos: mockPosts.slice(2, 4),
};
function MuralView({ role }: { role: SocialRole }) {
  const [active, setActive] = useState<string | null>(null);
  const [posts, setPosts] = useState(muralPosts.geral);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<
    Record<number, string[]>
  >({});
  const murals = [
    {
      key: "geral",
      title: "Mural geral",
      text: "Comunicados para toda a comunidade escolar.",
    },
    {
      key: "turma",
      title: "Avisos da turma",
      text: "Informações e novidades da sua turma.",
    },
    {
      key: "eventos",
      title: "Eventos da escola",
      text: "Confira os próximos eventos e atividades.",
    },
  ];
  const openMural = (key: string) => {
    setActive(key);
    setPosts(muralPosts[key as keyof typeof muralPosts]);
    setLikedPosts([]);
    setCommentsByPost({});
  };
  const toggleLike = (postId: number) => {
    const liked = likedPosts.includes(postId);
    setLikedPosts((current) =>
      liked ? current.filter((id) => id !== postId) : [...current, postId],
    );
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + (liked ? -1 : 1) }
          : post,
      ),
    );
  };
  const addComment = (postId: number, text: string) => {
    setCommentsByPost((current) => ({
      ...current,
      [postId]: [...(current[postId] ?? []), text],
    }));
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, comments: post.comments + 1 } : post,
      ),
    );
  };
  return (
    <>
      {!active ? (
        <>
          <PageIntro
            title="Murais"
            text="Acompanhe os comunicados e novidades da escola."
          />
          <div className="mural-grid">
            {murals.map((mural) => (
              <article className="social-card mural-card" key={mural.key}>
                <div>
                  <Badge>Rede Social Escolar</Badge>
                  <h2>{mural.title}</h2>
                  <p>{mural.text}</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => openMural(mural.key)}
                >
                  Ver publicações <ChevronRight />
                </button>
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="back-platform" onClick={() => setActive(null)}>
            <ArrowLeft /> Voltar aos murais
          </button>
          <PageIntro
            title={murals.find((m) => m.key === active)?.title ?? "Mural"}
            text="Publicações deste mural."
          />
          <div className="feed-list">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                liked={likedPosts.includes(post.id)}
                onLike={() => toggleLike(post.id)}
                onComment={(text) => addComment(post.id, text)}
                comments={commentsByPost[post.id] ?? []}
                isOwn={false}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function PageIntro({ title, text }: { title: string; text: string }) {
  return (
    <div className="social-heading">
      <Badge>Rede Social Escolar</Badge>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
