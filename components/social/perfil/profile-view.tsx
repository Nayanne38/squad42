"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { mockPosts, type Group, type SocialRole } from "@/data/shared/social";
import { Avatar } from "@/components/social/shared/social-ui";
import { PostCardProfile } from "@/components/social/feed/feed-components";

export function ProfileView({ role, posts, ownPostIds, likedPosts, groups = [], joinedIds = [] }: { role: SocialRole; posts: typeof mockPosts; ownPostIds: number[]; likedPosts: number[]; groups?: Group[]; joinedIds?: number[] }) {
  const [tab, setTab] = useState<"posts" | "groups">("posts");
  const myGroups = role === "funcionario" || role === "coordenacao" ? groups : groups.filter((group) => joinedIds.includes(group.id));
  const profileLabels = { aluno: "Rafael da Silva Moura", responsavel: "Responsável Modelo", funcionario: "Fernanda Lima", coordenacao: "Fabricya Nayanne Santos" };
  const profilePosts = posts.filter((post) => post.name === profileLabels[role] || ownPostIds.includes(post.id));
  const lPosts = posts.filter((post) => post.name === profileLabels[role] || likedPosts.includes(post.id));
  return <>
  <div className="social-heading">
    <span className="social-badge">Rede Social Escolar</span>
    <h1>Meu perfil</h1>
    <p>Veja suas publicações e grupos de estudo.</p>
  </div>
  
  <div className="profile-hero social-card">
    <Avatar initials={role === "funcionario" ? "FL" : role === "coordenacao" ? "FN" : "RM"} color="blue" />
    <div>
      <h2>{profileLabels[role]}</h2>
      <p>{role === "aluno" ? "Aluno · 8º Ano A" : role === "responsavel" ? "Responsável de Rafael da Silva Moura" : "Coordenação Pedagógica"}</p>
    </div>
    <Link className="outline-button" href={`/${role === "coordenacao" ? "admin" : role}/perfil`}><Pencil />Editar perfil e foto</Link>
  </div>
    
  <div className="profile-tabs">
    <button className={tab === "posts" ? "active" : ""} onClick={() => setTab("posts")}>Publicações</button>
    {role !== "responsavel" && <button className={tab === "groups" ? "active" : ""} onClick={() => setTab("groups")}>Grupos de estudo</button>}
  </div>
  
  {tab === "groups" ? (myGroups.length > 0
    ? <div className="groups-grid">{myGroups.map((group) => <div className="group-card" key={group.id}><div className={`group-icon ${group.color}`}>{group.icon}</div><div><b>{group.title}</b><small>{group.subject}</small><span>{group.members}</span></div></div>)}</div>
    : <p className="zx-empty">Você ainda não participa de nenhum grupo de estudo.</p>)
  : <div className="feed-list">{profilePosts.filter((p) => lPosts.includes(p)).map((post) => 
    <PostCardProfile key={post.id} post={post}  />)}
  </div>}
</>;
}
