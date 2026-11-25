"use client";

import { useState } from "react";
import { Check, ChevronRight, Paperclip, Plus, Search, Send } from "lucide-react";
import { chatAllowedKinds, formatFileSize, mockContacts, mockMessages, type SocialRole } from "@/data/shared/social";
import { Avatar } from "@/components/social/shared/social-ui";

export function Chat({ role = "aluno" }: { role?: SocialRole }) {
  const [search, setSearch] = useState("");
  const allowedContacts = mockContacts.filter((contact) => !contact.kind || chatAllowedKinds[role].includes(contact.kind));
  const [active, setActive] = useState(allowedContacts[0] ?? mockContacts[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [draft, setDraft] = useState("");
  const [fileError, setFileError] = useState("");
  const sendFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setFileError(`"${file.name}" passa de 5 MB.`);
    setFileError("");
    setMessages((current) => [...current, { id: Date.now(), contactId: active.id, text: "", file: `${file.name} (${formatFileSize(file.size)})`, mine: true, time: "agora" }]);
  };
  const contacts = allowedContacts.filter((contact) => contact.name.toLowerCase().includes(search.toLowerCase()));

  return <div className="chat-layout"><aside className="chat-sidebar"><div className="section-heading"><h2>Chat direto</h2><button aria-label="Nova conversa"><Plus /></button></div><p className="zx-notice">{role === "responsavel" ? "Você pode conversar com professores e com a coordenação." : role === "aluno" ? "Você pode conversar com professores, coordenação e colegas." : "Você pode conversar com alunos, responsáveis e equipe."}</p><div className="search-box"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar contatos" aria-label="Pesquisar contatos" /></div>{contacts.length === 0 && <p className="zx-empty">Nenhum contato encontrado.</p>}{contacts.map((contact) => <button className={`contact ${active.id === contact.id ? "active" : ""}`} key={contact.id} onClick={() => setActive(contact)}><Avatar initials={contact.initials} color={contact.color} online={contact.online} /><span><b>{contact.name}</b><small>{contact.profile}</small></span><ChevronRight /></button>)}</aside><section className="chat-window"><div className="chat-title"><Avatar initials={active.initials} color={active.color} online={active.online} /><div><b>{active.name}</b><small>{active.online ? "Online agora" : "Offline"}</small></div></div><div className="messages">{messages.filter((message) => message.contactId === active.id).map((message) => <div className={`message ${message.mine ? "mine" : ""}`} key={message.id}><span>{message.file ? <><Paperclip size={13} /> {message.file}</> : message.text}</span><small>{message.time}{message.mine && <Check />}</small></div>)}</div>{fileError && <p className="zx-error">{fileError}</p>}<form className="message-form" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setMessages([...messages, { id: Date.now(), contactId: active.id, text: draft, mine: true, time: "agora" }]); setDraft(""); }}><label className="chat-attach" aria-label="Anexar arquivo"><Paperclip /><input type="file" className="invisible" onChange={(event) => { sendFile(event.target.files?.[0]); event.target.value = ""; }} /></label><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escreva uma mensagem..." aria-label="Mensagem" /><button aria-label="Enviar mensagem"><Send /></button></form></section></div>;
}
