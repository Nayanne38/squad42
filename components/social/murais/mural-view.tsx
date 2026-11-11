"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { mockPosts, type SocialRole } from "@/data/shared/social";
import { PostCard, PostComposer } from "@/components/social/feed/feed-components";
import { Badge, PageIntro } from "@/components/social/shared/social-ui";

const muralPosts = { geral: mockPosts.slice(0, 2), turma: mockPosts.slice(1, 3), eventos: mockPosts.slice(2, 4) };
const murals = [{ key: "geral", title: "Mural geral", text: "Comunicados para toda a comunidade escolar." }, { key: "turma", title: "Avisos da turma", text: "Informações e novidades da sua turma." }, { key: "eventos", title: "Eventos da escola", text: "Confira os próximos eventos e atividades." }];
type MuralKey = keyof typeof muralPosts;
export const initialMuralPosts = muralPosts;

export function MuralView({
  role,
  postsByMural,
  setPostsByMural,
}: {
  role: SocialRole;
  postsByMural: typeof initialMuralPosts;
  setPostsByMural: Dispatch<SetStateAction<typeof initialMuralPosts>>;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<number, string[]>>({});
  const posts = active ? postsByMural[active as MuralKey] : [];

  const openMural = (key: string) => { setActive(key); setLikedPosts([]); setCommentsByPost({}); };
  const toggleLike = (postId: number) => {
    if (!active) return;
    const liked = likedPosts.includes(postId);
    setLikedPosts((current) => liked ? current.filter((id) => id !== postId) : [...current, postId]);
    setPostsByMural((current) => ({
      ...current,
      [active]: current[active as MuralKey].map((post) => post.id === postId ? { ...post, likes: post.likes + (liked ? -1 : 1) } : post),
    }));
  };
  const addComment = (postId: number, text: string) => {
    if (!active) return;
    setCommentsByPost((current) => ({ ...current, [postId]: [...(current[postId] ?? []), text] }));
    setPostsByMural((current) => ({
      ...current,
      [active]: current[active as MuralKey].map((post) => post.id === postId ? { ...post, comments: post.comments + 1 } : post),
    }));
  };
  const publishPost = (text: string) => {
    if (!active) return;
    const profileLabels = { aluno: "Aluno", responsavel: "Responsável", funcionario: "Funcionário" };
    const colors = { aluno: "blue", responsavel: "blue", funcionario: "purple" };
    const initials = role === "funcionario" ? "FL" : "AM";
    setPostsByMural((current) => {
      const posts = current[active as MuralKey];
      return {
        ...current,
        [active]: [{
          id: Math.max(0, ...posts.map((post) => post.id)) + 1,
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
          comments={commentsByPost[post.id] ?? []} isOwn={false} onEdit={() => {}} onDelete={() => {}} />)}
        </div>
      </>;
}
