"use client";

import { useState } from "react";
import { Heart, ImagePlus, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { mockPosts, type SocialRole } from "@/data/shared/social";
import { Avatar } from "@/components/social/shared/social-ui";

export function PostCard({
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
          <small>{post.profile} · {post.date}</small>
        </div>
        {isOwn && (
          <div className="post-owner-actions">
            <button type="button" onClick={() => setEditing(true)}>Editar</button>
            <button type="button" onClick={onDelete}>Excluir</button>
          </div>
        )}
        <MoreHorizontal size={18} />
      </div>
      {editing ? (
        <form className="edit-post-form" onSubmit={(event) => {
          event.preventDefault();
          if (draft.trim()) {
            onEdit(draft.trim());
            setEditing(false);
          }
        }}>
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} />
          <div>
            <button type="button" onClick={() => { setDraft(post.text); setEditing(false); }}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      ) : <p>{post.text}</p>}
      {post.image && <img className="post-image" src={post.image} alt="Registro de atividade escolar" />}
      <div className="post-actions">
        <button className={liked ? "liked" : ""} onClick={onLike} aria-pressed={liked}>
          <Heart fill={liked ? "currentColor" : "none"} /> {post.likes}
        </button>
        <button type="button" onClick={() => setShowComments((value) => !value)} aria-expanded={showComments}>
          <MessageCircle /> {post.comments} comentários
        </button>
        <button className="post-more">Compartilhar</button>
      </div>
      {showComments && (
        <div className="comments-list">
          {comments.length ? comments.map((item, index) => <p key={`${post.id}-comment-${index}`}><b>Comentário: </b>{item}</p>) : <small>Nenhum comentário ainda.</small>}
        </div>
      )}
      <form className="comment-form" onSubmit={(event) => {
        event.preventDefault();
        if (!comment.trim()) return;
        onComment(comment.trim());
        setComment("");
        setShowComments(true);
      }}>
        <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Adicione um comentário..." aria-label="Adicionar comentário" />
        <button type="submit" aria-label="Publicar comentário"><Send /></button>
      </form>
    </article>
  );
}

export function PostCardProfile({
  post,
}: {
  post: (typeof mockPosts)[number];
}) {
  return (
    <article className="social-card post-card">
      <div className="post-head">
        <Avatar initials={post.initials} color={post.color} />
        <div>
          <b>{post.name}</b>
          <small>{post.profile} · {post.date}</small>
        </div>
        <MoreHorizontal size={18} />
      </div>
      <p>{post.text}</p>
      {post.image && <img className="post-image" src={post.image} alt="Registro de atividade escolar" />}
    </article>
  );
}


export function PostComposer({ role, onPublish }: { role: SocialRole; onPublish: (text: string) => void }) {
  const [text, setText] = useState("");
  const profileLabels = { aluno: "Aluno Modelo 101", responsavel: "Responsável Modelo", funcionario: "Fernanda Lima" };
  const currentName = profileLabels[role];
  const initials = role === "funcionario" ? "FL" : "AM";

  return (
    <div className="social-card composer">
      <div className="post-head"><Avatar initials={initials} color={role === "funcionario" ? "purple" : "blue"} /><div><b>{currentName}</b><small>Compartilhe algo com a comunidade</small></div></div>
      <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="No que você está pensando?" aria-label="Texto da publicação" />
      <div className="composer-bottom">
      <label className="attach"><input type="file" className="invisible" accept="image/*" /><ImagePlus />Adicionar imagem</label>
      <button className="primary-button" disabled={!text.trim()} onClick={() => { onPublish(text); setText(""); }}>Publicar <Send /></button></div>
    </div>
  );
}
