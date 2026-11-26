"use client";

import { useState, type FormEvent } from "react";
import { ChevronRight } from "lucide-react";
import { hobbyCatalog, hobbyCategories, type HobbyItem } from "@/data/shared/rede-social";
import type { Hobby } from "@/data/shared/social";
import { Circle, Modal, PageHead, Pills, SearchField } from "@/components/rede-social/ui";

export function HobbyCard({ hobby }: { hobby: Hobby }) {
  return <div className={`social-card hobby-card ${hobby.color}`}><span>{hobby.emoji}</span><h3>{hobby.title}</h3><p>{hobby.description}</p><button>Explorar <ChevronRight /></button></div>;
}

export function HobbiesView() {
  const [items, setItems] = useState<HobbyItem[]>(hobbyCatalog);
  const [joined, setJoined] = useState<number[]>([1]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("Todos");
  const [suggesting, setSuggesting] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const visible = items.filter(
    (item) =>
      (category === "Todos" || item.category === category) &&
      item.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const toggle = (id: number) => {
    const isJoined = joined.includes(id);
    setJoined((current) => (isJoined ? current.filter((value) => value !== id) : [...current, id]));
    setItems((current) => current.map((item) => (item.id === id ? { ...item, members: item.members + (isJoined ? -1 : 1) } : item)));
  };

  const suggest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim().length < 3) return setError("Informe o nome do hobby (mínimo 3 letras).");
    setSuggesting(false);
    setName("");
    setError("");
    setNotice("Sugestão enviada para aprovação da coordenação.");
  };

  return (
    <>
      <PageHead
        title="Hobbies"
        subtitle="Encontre quem curte o mesmo que você"
        action={<button type="button" className="rs-primary" onClick={() => setSuggesting(true)}>+ Sugerir hobby</button>}
      />
      <SearchField value={search} onChange={setSearch} placeholder="Pesquisar hobbies" />
      <Pills options={hobbyCategories} value={category} onChange={setCategory} ariaLabel="Categorias de hobbies" />
      {notice && <p className="rs-note-msg" role="status">{notice}</p>}
      {visible.length === 0 ? (
        <p className="rs-empty">Nenhum hobby encontrado.</p>
      ) : (
        <div className="rs-cards four">
          {visible.map((item) => (
            <article className="rs-card center" key={item.id}>
              <Circle size={64} />
              <h3>{item.title}</h3>
              <small>{item.members} membros</small>
              <button type="button" className={`rs-outline ${joined.includes(item.id) ? "on" : ""}`} onClick={() => toggle(item.id)}>
                {joined.includes(item.id) ? "Participando" : "Participar"}
              </button>
            </article>
          ))}
        </div>
      )}
      {suggesting && (
        <Modal title="Sugerir hobby" onClose={() => setSuggesting(false)}>
          <form className="rs-form" onSubmit={suggest} noValidate>
            <label htmlFor="hobby-name">Nome do hobby</label>
            <input id="hobby-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Astronomia" />
            {error && <p className="rs-error">{error}</p>}
            <button type="submit" className="rs-primary center">Enviar sugestão</button>
          </form>
        </Modal>
      )}
    </>
  );
}
