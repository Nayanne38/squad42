"use client";

import { useState } from "react";
import { Check, ChevronRight, Plus, Search, Send } from "lucide-react";
import { mockContacts, mockMessages } from "@/data/shared/social";
import { Avatar } from "@/components/social/shared/social-ui";

export function Chat() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(mockContacts[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [draft, setDraft] = useState("");
  const contacts = mockContacts.filter((contact) => contact.name.toLowerCase().includes(search.toLowerCase()));

  return <div className="chat-layout"><aside className="chat-sidebar"><div className="section-heading"><h2>Chat direto</h2><button aria-label="Nova conversa"><Plus /></button></div><div className="search-box"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar contatos" aria-label="Pesquisar contatos" /></div>{contacts.map((contact) => <button className={`contact ${active.id === contact.id ? "active" : ""}`} key={contact.id} onClick={() => setActive(contact)}><Avatar initials={contact.initials} color={contact.color} online={contact.online} /><span><b>{contact.name}</b><small>{contact.profile}</small></span><ChevronRight /></button>)}</aside><section className="chat-window"><div className="chat-title"><Avatar initials={active.initials} color={active.color} online={active.online} /><div><b>{active.name}</b><small>{active.online ? "Online agora" : "Offline"}</small></div></div><div className="messages">{messages.filter((message) => message.contactId === active.id).map((message) => <div className={`message ${message.mine ? "mine" : ""}`} key={message.id}><span>{message.text}</span><small>{message.time}{message.mine && <Check />}</small></div>)}</div><form className="message-form" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setMessages([...messages, { id: Date.now(), contactId: active.id, text: draft, mine: true, time: "agora" }]); setDraft(""); }}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escreva uma mensagem..." aria-label="Mensagem" /><button aria-label="Enviar mensagem"><Send /></button></form></section></div>;
}
