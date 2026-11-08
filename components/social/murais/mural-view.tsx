"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { mockPosts, type SocialRole } from "@/data/shared/social";
import { PostCard } from "@/components/social/feed/feed-components";
import { Badge, PageIntro } from "@/components/social/shared/social-ui";

const muralPosts = { geral: mockPosts.slice(0, 2), turma: mockPosts.slice(1, 3), eventos: mockPosts.slice(2, 4) };
const murals = [{ key: "geral", title: "Mural geral", text: "Comunicados para toda a comunidade escolar." }, { key: "turma", title: "Avisos da turma", text: "Informações e novidades da sua turma." }, { key: "eventos", title: "Eventos da escola", text: "Confira os próximos eventos e atividades." }];

export function MuralView({ role: _role }: { role: SocialRole }) {
  const [active, setActive] = useState<string | null>(null);
  const [posts, setPosts] = useState(muralPosts.geral);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<number, string[]>>({});
  const openMural = (key: string) => { setActive(key); setPosts(muralPosts[key as keyof typeof muralPosts]); setLikedPosts([]); setCommentsByPost({}); };
  const toggleLike = (postId: number) => { const liked = likedPosts.includes(postId); setLikedPosts((current) => liked ? current.filter((id) => id !== postId) : [...current, postId]); setPosts((current) => current.map((post) => post.id === postId ? { ...post, likes: post.likes + (liked ? -1 : 1) } : post)); };
  const addComment = (postId: number, text: string) => { setCommentsByPost((current) => ({ ...current, [postId]: [...(current[postId] ?? []), text] })); setPosts((current) => current.map((post) => post.id === postId ? { ...post, comments: post.comments + 1 } : post)); };

  return !active ? <><PageIntro title="Murais" text="Acompanhe os comunicados e novidades da escola." /><div className="mural-grid">{murals.map((mural) => <article className="social-card mural-card" key={mural.key}><div><Badge>Rede Social Escolar</Badge><h2>{mural.title}</h2><p>{mural.text}</p></div><button className="primary-button" onClick={() => openMural(mural.key)}>Ver publicações <ChevronRight /></button></article>)}</div></> : <><button className="back-platform" onClick={() => setActive(null)}><ArrowLeft /> Voltar aos murais</button><PageIntro title={murals.find((mural) => mural.key === active)?.title ?? "Mural"} text="Publicações deste mural." /><div className="feed-list">{posts.map((post) => <PostCard key={post.id} post={post} liked={likedPosts.includes(post.id)} onLike={() => toggleLike(post.id)} onComment={(text) => addComment(post.id, text)} comments={commentsByPost[post.id] ?? []} isOwn={false} onEdit={() => {}} onDelete={() => {}} />)}</div></>;
}
