"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { type Group, type Post, type SocialRole } from "@/data/shared/social";
import { PostCard, PostComposer } from "@/components/social/feed/feed-components";
import { Badge, PageIntro } from "@/components/social/shared/social-ui";

export function GroupCard({ group, onClick }: { group: Group; onClick: () => void }) {
  return <button className="group-card" onClick={onClick}><div className={`group-icon ${group.color}`}>{group.icon}</div><div><b>{group.title}</b><small>{group.subject}</small><span>{group.members}</span></div><ChevronRight /></button>;
}

export function StudyGroupsView({
  role,
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
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const activeGroup = groups.find((group) => group.id === activeGroupId);
  const posts = activeGroupId === null ? [] : groupPosts[activeGroupId] ?? [];
  const likedPostIds = activeGroupId === null ? [] : likedPostIdsByGroup[activeGroupId] ?? [];
  const comments = activeGroupId === null ? {} : commentsByGroup[activeGroupId] ?? {};

  const createGroup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (role !== "funcionario") return;
    const title = newGroupTitle.trim();
    const subject = newGroupDescription.trim();
    if (!title || !subject) return;

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

  const publishPost = (text: string) => {
    if (activeGroupId === null) return;
    const id = Math.max(0, ...(groupPosts[activeGroupId] ?? []).map((post) => post.id)) + 1;
    const profileLabels = { aluno: "Aluno", responsavel: "Responsável", funcionario: "Funcionário" };
    const colors = { aluno: "blue", responsavel: "blue", funcionario: "purple" };
    setGroupPosts((current) => ({
      ...current,
      [activeGroupId]: [{
        id,
        name: role === "funcionario" ? "Fernanda Lima" : role === "responsavel" ? "Responsável Modelo" : "Aluno Modelo 101",
        profile: profileLabels[role],
        date: "Agora",
        text,
        initials: role === "funcionario" ? "FL" : "AM",
        color: colors[role],
        likes: 0,
        comments: 0,
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

    return <>
      <PageIntro title="Grupos de estudos" text="Encontre seus colegas e aprenda em conjunto." />
      {role === "funcionario" && <div className="direita"><button className="primary-button" onClick={() => setCreatingGroup(true)}>Criar grupo</button></div>}
      <div className="groups-grid">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} onClick={() => setActiveGroupId(group.id)} />
        ))}
      </div>
    </>;
  }

  return <>
    <button className="back-platform" onClick={() => setActiveGroupId(null)}><ArrowLeft /> Voltar aos grupos</button>
    <PageIntro title={activeGroup.title} text={`${activeGroup.subject} · ${activeGroup.members}`} />
    <div className="social-card mural-card">
      <Badge>Mural do grupo de estudo</Badge>
       <PostComposer role={role} onPublish={publishPost} />
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
