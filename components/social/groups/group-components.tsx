"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { type Attachment, type Group, type Post, type SocialRole } from "@/data/shared/social";
import { PostCard, PostComposer } from "@/components/social/feed/feed-components";
import { Badge, PageIntro } from "@/components/social/shared/social-ui";
import { GroupsGrid } from "@/components/rede-social/group-grid";

export function GroupCard({ group, joined = false, onClick }: { group: Group; joined?: boolean; onClick: () => void }) {
  return <button className="group-card" onClick={onClick}><div className={`group-icon ${group.color}`}>{group.icon}</div><div><b>{group.title}</b><small>{group.subject}</small><span>{group.members}{joined ? " · Participando" : ""}</span></div><ChevronRight /></button>;
}

export function StudyGroupsView({
  role,
  joinedIds,
  onToggleJoin,
  groups,
  setGroups,
  groupPosts,
  setGroupPosts,
  ownPostIdsByGroup,
  setOwnPostIdsByGroup,
  likedPostIdsByGroup,
  setLikedPostIdsByGroup,
  commentsByGroup,
  setCommentsByGroup,
}: {
  role: SocialRole;
  joinedIds: number[];
  onToggleJoin: (groupId: number) => void;
  groups: Group[];
  setGroups: Dispatch<SetStateAction<Group[]>>;
  groupPosts: Record<number, Post[]>;
  setGroupPosts: Dispatch<SetStateAction<Record<number, Post[]>>>;
  ownPostIdsByGroup: Record<number, number[]>;
  setOwnPostIdsByGroup: Dispatch<SetStateAction<Record<number, number[]>>>;
  likedPostIdsByGroup: Record<number, number[]>;
  setLikedPostIdsByGroup: Dispatch<SetStateAction<Record<number, number[]>>>;
  commentsByGroup: Record<number, Record<number, string[]>>;
  setCommentsByGroup: Dispatch<SetStateAction<Record<number, Record<number, string[]>>>>;
}) {
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupNotice, setGroupNotice] = useState("");
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const activeGroup = groups.find((group) => group.id === activeGroupId);
  const posts = activeGroupId === null ? [] : groupPosts[activeGroupId] ?? [];
  const likedPostIds = activeGroupId === null ? [] : likedPostIdsByGroup[activeGroupId] ?? [];
  const comments = activeGroupId === null ? {} : commentsByGroup[activeGroupId] ?? {};

  const createGroup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (role !== "funcionario" && role !== "aluno") return;
    const title = newGroupTitle.trim();
    const subject = newGroupDescription.trim();
    if (!title || !subject) return;

    // Grupos criados por alunos passam por aprovação da coordenação antes de aparecer na lista.
    if (role === "aluno") {
      setNewGroupTitle("");
      setNewGroupDescription("");
      setCreatingGroup(false);
      setGroupNotice(`O grupo "${title}" foi enviado para aprovação da coordenação.`);
      return;
    }

    setGroups((current) => [...current, {
      id: Math.max(0, ...current.map((group) => group.id)) + 1,
      title,
      subject,
      members: "0 participantes",
      color: "blue",
      icon: "✦",
    }]);
    setNewGroupTitle("");
    setNewGroupDescription("");
    setCreatingGroup(false);
  };

  const publishPost = (text: string, attachments?: Attachment[], image?: string) => {
    if (activeGroupId === null) return;
    const id = Math.max(0, ...(groupPosts[activeGroupId] ?? []).map((post) => post.id)) + 1;
    const profileLabels = { aluno: "Aluno", responsavel: "Responsável", funcionario: "Funcionário", coordenacao: "Coordenação" };
    const colors = { aluno: "blue", responsavel: "blue", funcionario: "purple", coordenacao: "gold" };
    setGroupPosts((current) => ({
      ...current,
      [activeGroupId]: [{
        id,
        name: role === "funcionario" ? "Fernanda Lima" : role === "responsavel" ? "Responsável Modelo" : "Rafael da Silva Moura",
        profile: profileLabels[role],
        date: "Agora",
        text,
        initials: role === "funcionario" ? "FL" : "RM",
        color: colors[role],
        likes: 0,
        comments: 0,
        image,
        attachments,
      }, ...(current[activeGroupId] ?? [])],
    }));
    setOwnPostIdsByGroup((current) => ({
      ...current,
      [activeGroupId]: [...(current[activeGroupId] ?? []), id],
    }));
  };

  const toggleLike = (postId: number) => {
    if (activeGroupId === null) return;
    const liked = likedPostIds.includes(postId);
    setLikedPostIdsByGroup((current) => ({
      ...current,
      [activeGroupId]: liked
        ? (current[activeGroupId] ?? []).filter((id) => id !== postId)
        : [...(current[activeGroupId] ?? []), postId],
    }));
    setGroupPosts((current) => ({
      ...current,
      [activeGroupId]: (current[activeGroupId] ?? []).map((post) => post.id === postId
        ? { ...post, likes: post.likes + (liked ? -1 : 1) }
        : post),
    }));
  };

  const addComment = (postId: number, text: string) => {
    if (activeGroupId === null) return;
    setCommentsByGroup((current) => ({
      ...current,
      [activeGroupId]: {
        ...(current[activeGroupId] ?? {}),
        [postId]: [...(current[activeGroupId]?.[postId] ?? []), text],
      },
    }));
    setGroupPosts((current) => ({
      ...current,
      [activeGroupId]: (current[activeGroupId] ?? []).map((post) => post.id === postId
        ? { ...post, comments: post.comments + 1 }
        : post),
    }));
  };

  if (!activeGroup) {
    if (creatingGroup) {
      return <>
        <button className="back-platform" onClick={() => setCreatingGroup(false)}><ArrowLeft /> Voltar aos grupos</button>
        <PageIntro title="Criar grupo de estudos" text="Crie um espaço para reunir participantes em torno de um tema." />
        <form className="social-card publish-form" onSubmit={createGroup}>
          <label htmlFor="study-group-title">Nome do grupo</label>
          <input id="study-group-title" value={newGroupTitle} onChange={(event) => setNewGroupTitle(event.target.value)} placeholder="Ex.: Clube de Robótica" required />
          <label htmlFor="study-group-description">Matéria</label>
          <textarea id="study-group-description" value={newGroupDescription} onChange={(event) => setNewGroupDescription(event.target.value)} placeholder="Descreva o tema do grupo..." required />
          <button className="primary-button" type="submit">Criar grupo</button>
        </form>
      </>;
    }

    return <GroupsGrid
      role={role}
      groups={groups}
      joinedIds={joinedIds}
      notice={groupNotice}
      onOpen={setActiveGroupId}
      onToggleJoin={onToggleJoin}
      onCreate={() => { setGroupNotice(""); setCreatingGroup(true); }}
    />;
  }

  return <>
    <button className="back-platform" onClick={() => setActiveGroupId(null)}><ArrowLeft /> Voltar aos grupos</button>
    <PageIntro title={activeGroup.title} text={`${activeGroup.subject} · ${activeGroup.members}`} />
    {role === "funcionario"
      ? <p className="zx-notice">Como professor, você acompanha as discussões deste grupo e pode participar a qualquer momento.</p>
      : <div className="zx-actions">
          <button className={joinedIds.includes(activeGroup.id) ? "outline-button" : "primary-button"} onClick={() => onToggleJoin(activeGroup.id)}>
            {joinedIds.includes(activeGroup.id) ? "Sair do grupo" : "Entrar no grupo"}
          </button>
        </div>}
    <div className="social-card mural-card">
      <Badge>Mural do grupo de estudo</Badge>
       {role === "funcionario" || joinedIds.includes(activeGroup.id)
        ? <PostComposer role={role} onPublish={publishPost} />
        : <p className="zx-notice">Entre no grupo para publicar e comentar.</p>}
    {posts.length > 0 ? <div className="feed-list">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          liked={likedPostIds.includes(post.id)}
          onLike={() => toggleLike(post.id)}
          onComment={(text) => addComment(post.id, text)}
          comments={comments[post.id] ?? []}
          isOwn={(ownPostIdsByGroup[activeGroup.id] ?? []).includes(post.id)}
          onEdit={(text) => setGroupPosts((current) => ({
            ...current,
            [activeGroup.id]: (current[activeGroup.id] ?? []).map((item) => item.id === post.id ? { ...item, text } : item),
          }))}
          onDelete={() => {
            setGroupPosts((current) => ({
              ...current,
              [activeGroup.id]: (current[activeGroup.id] ?? []).filter((item) => item.id !== post.id),
            }));
            setOwnPostIdsByGroup((current) => ({
              ...current,
              [activeGroup.id]: (current[activeGroup.id] ?? []).filter((id) => id !== post.id),
            }));
          }}
        />
      ))}
    </div> : <p className="empty-state">ㅤAinda não há publicações neste grupo. Seja o primeiro a compartilhar algo!</p>}
    </div>
  </>;
}
