"use client";

import { sessionOfSocial, useDemoUser } from "@/lib/demo-session";
import { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal, Paperclip, Send, X } from "lucide-react";
import { formatFileSize, mockPosts, type Attachment, type SocialRole } from "@/data/shared/social";

const MAX_FILES = 3;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function AttachmentList({ attachments }: { attachments?: Attachment[] }) {
  if (!attachments?.length) return null;
  return <div className="attachment-list">{attachments.map((file, index) => <span className="attachment-chip" key={`${file.name}-${index}`}><Paperclip size={13} />{file.name}<small>{file.size}</small></span>)}</div>;
}
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
      <AttachmentList attachments={post.attachments} />
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
      <AttachmentList attachments={post.attachments} />
    </article>
  );
}


export function PostComposer({ role, onPublish }: { role: SocialRole; onPublish: (text: string, attachments?: Attachment[], image?: string) => void }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.find((file) => file.size > MAX_FILE_BYTES);
    if (tooBig) return setFileError(`"${tooBig.name}" passa de 5 MB.`);
    if (files.length + incoming.length > MAX_FILES) return setFileError(`Anexe no máximo ${MAX_FILES} arquivos por publicação.`);
    setFileError("");
    setFiles((current) => [...current, ...incoming]);
  };
  const publish = () => {
    const firstImage = files.find((file) => file.type.startsWith("image/"));
    onPublish(
      text,
      files.filter((file) => file !== firstImage).map((file) => ({ name: file.name, size: formatFileSize(file.size) })),
      firstImage ? URL.createObjectURL(firstImage) : undefined,
    );
    setText("");
    setFiles([]);
  };
  const me = useDemoUser(sessionOfSocial(role));
  const currentName = me.name;
  const initials = me.initials;

  return (
    <div className="social-card composer">
      <div className="post-head"><Avatar initials={initials} color={role === "funcionario" ? "purple" : "blue"} /><div><b>{currentName}</b><small>Compartilhe algo com a comunidade</small></div></div>
      <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="No que você está pensando?" aria-label="Texto da publicação" />
      <div className="composer-bottom">
      <label className="attach"><input type="file" multiple className="invisible" accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" aria-label="Anexar arquivos" onChange={(event) => { addFiles(event.target.files); event.target.value = ""; }} /><Paperclip />Anexar arquivo</label>
      <button className="primary-button" disabled={!text.trim()} onClick={publish}>Publicar <Send /></button></div>
      {fileError && <p className="zx-error">{fileError}</p>}
      {files.length > 0 && <div className="attachment-list">{files.map((file, index) => <span className="attachment-chip" key={`${file.name}-${index}`}><Paperclip size={13} />{file.name}<small>{formatFileSize(file.size)}</small><button type="button" aria-label={`Remover ${file.name}`} onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}><X size={12} /></button></span>)}</div>}
    </div>
  );
}
