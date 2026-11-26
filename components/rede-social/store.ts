"use client";

import { useState } from "react";
import { usePersisted } from "@/lib/persist";
import {
  boardNotes,
  doubts,
  pendingApprovals,
  schoolNotices,
  sentNotices,
} from "@/data/shared/rede-social";

export type Report = { id: number; title: string; reason: string; by: string };

/** Estado compartilhado entre as seções da rede social (dados simulados, em memória). */
export function useSocialStore() {
  const [notes, setNotes] = usePersisted("store:notes", boardNotes);
  const [doubtList, setDoubtList] = usePersisted("store:doubts", doubts);
  const [approvals, setApprovals] = usePersisted("store:approvals", pendingApprovals);
  const [reports, setReports] = usePersisted<Report[]>("store:reports", [
    { id: 1, title: "Comentário em “Dúvida de Português”", reason: "Linguagem imprópria", by: "Denunciado por 2 usuários" },
    { id: 2, title: "Publicação em “Hobbies · Futebol”", reason: "Spam", by: "Denunciado por 1 usuário" },
  ]);
  const [activity, setActivity] = usePersisted<string[]>("store:activity", [
    "Aprovou o grupo “Revisão para provas”",
    "Enviou comunicado a responsáveis",
    "Removeu 1 comentário denunciado",
  ]);
  const [sent, setSent] = usePersisted("store:sent", sentNotices);
  const [notices, setNotices] = usePersisted("store:notices", schoolNotices);
  const [resolvedReports, setResolvedReports] = usePersisted("store:resolved", 12);

  const log = (text: string) => setActivity((current) => [text, ...current].slice(0, 6));

  return {
    notes,
    setNotes,
    doubtList,
    setDoubtList,
    approvals,
    decideApproval: (id: number, approve: boolean) => {
      const item = approvals.find((entry) => entry.id === id);
      setApprovals((current) => current.filter((entry) => entry.id !== id));
      if (item) log(`${approve ? "Aprovou" : "Recusou"} ${item.kind.toLowerCase()} “${item.title}”`);
    },
    reports,
    decideReport: (id: number, remove: boolean) => {
      const item = reports.find((entry) => entry.id === id);
      setReports((current) => current.filter((entry) => entry.id !== id));
      setResolvedReports((current) => current + 1);
      if (item) log(`${remove ? "Removeu" : "Manteve"} conteúdo denunciado: ${item.title}`);
    },
    resolvedReports,
    activity,
    sent,
    sendNotice: (title: string, to: string) => {
      setSent((current) => [{ id: Date.now(), title, to, sent: "agora", read: 0 }, ...current]);
      setNotices((current) => [
        { id: Date.now() + 1, title, from: "Coordenação", when: "agora", text: title, read: false },
        ...current,
      ]);
      log(`Enviou comunicado “${title}” (${to})`);
    },
    notices,
    markNoticeRead: (id: number) =>
      setNotices((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item))),
  };
}

export type SocialStore = ReturnType<typeof useSocialStore>;
