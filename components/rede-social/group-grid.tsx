"use client";

import { useState } from "react";
import type { Group, SocialRole } from "@/data/shared/social";
import { Circle, PageHead, SearchField } from "@/components/rede-social/ui";

export function GroupsGrid({
  role,
  groups,
  joinedIds,
  notice,
  onOpen,
  onToggleJoin,
  onCreate,
}: {
  role: SocialRole;
  groups: Group[];
  joinedIds: number[];
  notice?: string;
  onOpen: (groupId: number) => void;
  onToggleJoin: (groupId: number) => void;
  onCreate: () => void;
}) {
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();
  const filtered = groups.filter((group) => `${group.title} ${group.subject}`.toLowerCase().includes(term));
  const mine = filtered.filter((group) => joinedIds.includes(group.id));
  const discover = filtered.filter((group) => !joinedIds.includes(group.id));
  const isStudent = role === "aluno";

  const renderCard = (group: Group, joined: boolean) => (
    <article className="rs-card center" key={group.id}>
      <Circle size={64} text={group.icon} />
      <h3>{group.title}</h3>
      <small>{group.members}</small>
      {isStudent && !joined ? (
        <button type="button" className="rs-outline" onClick={() => onToggleJoin(group.id)}>Entrar</button>
      ) : (
        <button type="button" className="rs-outline on" onClick={() => onOpen(group.id)}>Abrir</button>
      )}
    </article>
  );

  return (
    <>
      <PageHead
        title="Grupos de Estudo"
        subtitle={isStudent ? "Estude junto com a turma" : "Acompanhe os grupos de estudo da escola"}
        action={isStudent ? <button type="button" className="rs-primary" onClick={onCreate}>+ Criar grupo</button> : undefined}
      />
      <SearchField value={search} onChange={setSearch} placeholder="Pesquisar grupos" />
      {notice && <p className="rs-note-msg" role="status">{notice}</p>}
      {filtered.length === 0 && <p className="rs-empty">Nenhum grupo encontrado.</p>}
      {isStudent ? (
        <>
          {mine.length > 0 && (
            <>
              <h2 className="rs-section">Meus grupos</h2>
              <div className="rs-cards four">{mine.map((group) => renderCard(group, true))}</div>
            </>
          )}
          {discover.length > 0 && (
            <>
              <h2 className="rs-section">Descobrir</h2>
              <div className="rs-cards four">{discover.map((group) => renderCard(group, false))}</div>
            </>
          )}
          <p className="rs-hint">Novos grupos passam por aprovação da coordenação.</p>
        </>
      ) : (
        <div className="rs-cards four">{filtered.map((group) => renderCard(group, true))}</div>
      )}
    </>
  );
}
