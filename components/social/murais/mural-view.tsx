"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { ArrowLeft, ChevronRight, Plus } from "lucide-react";
import { mockPosts, type Post, type SocialRole } from "@/data/shared/social";
import { PostCard, PostComposer } from "@/components/social/feed/feed-components";
import { Badge, PageIntro } from "@/components/social/shared/social-ui";

const muralPosts = { geral: mockPosts.slice(0, 2), turma: mockPosts.slice(1, 3), eventos: mockPosts.slice(2, 4) };
export type Mural = { key: string; title: string; text: string };
export const initialMurals: Mural[] = [
  { key: "geral", title: "Mural geral", text: "Comunicados para toda a comunidade escolar." },
  { key: "turma", title: "Avisos da turma", text: "Informações e novidades da sua turma." },
  { key: "eventos", title: "Eventos da escola", text: "Confira os próximos eventos e atividades." },
];
export const initialMuralPosts: Record<string, Post[]> = {
  geral: muralPosts.geral,
  turma: muralPosts.turma,
  eventos: muralPosts.eventos,
};

export function MuralView({
  role,
  murals,
  postsByMural,
  setPostsByMural,
  ownPostIdsByMural,
  setOwnPostIdsByMural,
  onNavigateToCreateMural,
}: {
  role: SocialRole;
  murals: Mural[];
  postsByMural: Record<string, Post[]>;
  setPostsByMural: Dispatch<SetStateAction<Record<string, Post[]>>>;
  ownPostIdsByMural: Record<string, number[]>;
  setOwnPostIdsByMural: Dispatch<SetStateAction<Record<string, number[]>>>;
  onNavigateToCreateMural: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<number, string[]>>({});
  const posts = active ? postsByMural[active] ?? [] : [];

  const openMural = (key: string) => { setActive(key); setLikedPosts([]); setCommentsByPost({}); };
  const toggleLike = (postId: number) => {
    if (!active) return;
    const liked = likedPosts.includes(postId);
    setLikedPosts((current) => liked ? current.filter((id) => id !== postId) : [...current, postId]);
    setPostsByMural((current) => ({
      ...current,
      [active]: current[active].map((post) => post.id === postId ? { ...post, likes: post.likes + (liked ? -1 : 1) } : post),
    }));
  };
  const addComment = (postId: number, text: string) => {
    if (!active) return;
    setCommentsByPost((current) => ({ ...current, [postId]: [...(current[postId] ?? []), text] }));
    setPostsByMural((current) => ({
      ...current,
      [active]: current[active].map((post) => post.id === postId ? { ...post, comments: post.comments + 1 } : post),
    }));
  };
  const publishPost = (text: string) => {
    if (!active) return;
    const profileLabels = { aluno: "Aluno", responsavel: "Responsável", funcionario: "Funcionário" };
    const colors = { aluno: "blue", responsavel: "blue", funcionario: "purple" };
    const initials = role === "funcionario" ? "FL" : "AM";
    const id = Math.max(0, ...(postsByMural[active] ?? []).map((post) => post.id)) + 1;
    setOwnPostIdsByMural((currentIds) => ({
      ...currentIds,
      [active]: [...(currentIds[active] ?? []), id],
    }));
    setPostsByMural((current) => {
      const posts = current[active] ?? [];
      return {
        ...current,
        [active]: [{
          id,
          name: role === "funcionario" ? "Fernanda Lima" : role === "responsavel" ? "Responsável Modelo" : "Aluno Modelo 101",
          profile: profileLabels[role],
          date: "Agora",
          text,
          initials,
          color: colors[role],
          likes: 0,
          comments: 0,
        }, ...posts],
      };
    });
  };

  return !active ? <>
  <div className="direita"><button className="primary-button" onClick={onNavigateToCreateMural}><Plus /> Criar mural</button></div>
  <PageIntro title="Murais" text="Acompanhe os comunicados e novidades da escola." />
  <div className="mural-grid">
    {murals.map((mural) => <article className="social-card mural-card" key={mural.key}>
    <div>
      <Badge>Rede Social Escolar</Badge>
      <h2>{mural.title}</h2>
      <p>{mural.text}</p>
    </div>
    <button className="primary-button" onClick={() => openMural(mural.key)}>Ver publicações <ChevronRight /></button>
  </article>)}
  </div>
  </> : <>
    <button className="back-platform" onClick={() => setActive(null)}><ArrowLeft /> Voltar aos murais</button>
      <PageIntro title={murals.find((mural) => mural.key === active)?.title ?? "Mural"} text="Publicações deste mural." />
        <PostComposer role={role} onPublish={publishPost} />

        <div className="feed-list">{posts.map((post) =>
          <PostCard key={post.id} post={post} liked={likedPosts.includes(post.id)}
          onLike={() => toggleLike(post.id)} onComment={(text) => addComment(post.id, text)}
          comments={commentsByPost[post.id] ?? []} isOwn={(ownPostIdsByMural[active] ?? []).includes(post.id)}
          onEdit={(text) => setPostsByMural((current) => ({
            ...current,
            [active]: (current[active] ?? []).map((item) => item.id === post.id ? { ...item, text } : item),
          }))}
          onDelete={() => {
            setPostsByMural((current) => ({
              ...current,
              [active]: (current[active] ?? []).filter((item) => item.id !== post.id),
            }));
            setOwnPostIdsByMural((current) => ({
              ...current,
              [active]: (current[active] ?? []).filter((id) => id !== post.id),
            }));
          }} />)}
        </div>
      </>;
}
