"use client";

import { useState, type ChangeEvent } from "react";
import { Play } from "lucide-react";
import { videoLibrary, type LibraryVideo } from "@/data/shared/rede-social";
import { PageHead, Pills } from "@/components/rede-social/ui";

const subjects = ["Todas", "Matemática", "Português", "Ciências", "Geografia"] as const;

function Thumb({ video }: { video: LibraryVideo }) {
  return (
    <div className="rs-thumb">
      <span className="rs-play">
        <Play size={18} fill="currentColor" />
      </span>
    </div>
  );
}

export function StudentVideos({
  watchedIds,
  onOpen,
}: {
  watchedIds: number[];
  onOpen: (video: LibraryVideo) => void;
}) {
  const [subject, setSubject] = useState<string>("Todas");
  const published = videoLibrary.filter((video) => video.status === "Publicado" || video.isNew);
  const list = published.filter((video) => subject === "Todas" || video.subject === subject);
  const isDone = (video: LibraryVideo) => watchedIds.includes(video.id) || video.progress === 100;
  const resume = published.find((video) => !isDone(video) && video.progress > 0);
  const newCount = published.filter((video) => video.isNew && !isDone(video)).length + 4;

  return (
    <>
      <PageHead title="Vídeo Aulas" subtitle={`Assista no seu ritmo · ${newCount} novos esta semana`} />
      <Pills options={subjects} value={subject as never} onChange={setSubject as never} ariaLabel="Filtrar por disciplina" />
      <p className="rs-progress-line">
        {watchedIds.length} de {published.length} aulas concluídas · {published.length - watchedIds.length} pendentes
      </p>
      {resume && subject === "Todas" && (
        <div className="rs-resume">
          <Thumb video={resume} />
          <div>
            <small>Continue assistindo</small>
            <h3>{resume.title}</h3>
            <p>{resume.professor} · {resume.duration}</p>
            <div className="rs-progress-label"><span>Progresso</span><b>{resume.progress}%</b></div>
            <div className="rs-bar"><i className="tone-green" style={{ width: `${resume.progress}%` }} /></div>
            <button type="button" className="rs-primary" onClick={() => onOpen(resume)}>Continuar</button>
          </div>
        </div>
      )}
      {list.length === 0 ? (
        <p className="rs-empty">Nenhuma vídeo-aula nesta disciplina.</p>
      ) : (
        <div className="rs-cards">
          {list.map((video) => (
            <button type="button" className="rs-card video" key={video.id} onClick={() => onOpen(video)}>
              <Thumb video={video} />
              <h3>{video.title}</h3>
              <p>{video.professor} · {video.subject}</p>
              <small>
                {video.duration}
                {isDone(video) ? " · concluído" : video.isNew ? " · Novo" : video.progress ? ` · ${video.progress}%` : ""}
              </small>
              {isDone(video) && <span className="rs-badge ok">Concluído</span>}
              {!isDone(video) && video.isNew && <span className="rs-badge new">Novo</span>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export function TeacherVideos({ onOpen }: { onOpen: (video: LibraryVideo) => void }) {
  const [items, setItems] = useState<LibraryVideo[]>(videoLibrary.filter((video) => video.subject === "Matemática"));
  const [message, setMessage] = useState("");

  const addFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("video/")) return setMessage("Escolha um arquivo de vídeo (MP4).");
    if (file.size > 500 * 1024 * 1024) return setMessage("O vídeo deve ter no máximo 500 MB.");
    setMessage(`"${file.name}" adicionado como rascunho.`);
    setItems((current) => [
      {
        id: Date.now(),
        title: file.name.replace(/\.[^.]+$/, ""),
        professor: "Fernanda Lima",
        duration: "-- min",
        color: "green",
        initials: "FL",
        subject: "Matemática",
        description: "",
        progress: 0,
        views: 0,
        status: "Rascunho",
        classes: "Não publicado",
      },
      ...current,
    ]);
  };

  const togglePublish = (id: number) =>
    setItems((current) =>
      current.map((video) =>
        video.id === id
          ? { ...video, status: video.status === "Publicado" ? "Rascunho" : "Publicado", classes: video.status === "Publicado" ? "Não publicado" : "7º A" }
          : video,
      ),
    );

  return (
    <>
      <PageHead
        title="Vídeo Aulas"
        subtitle="Envie e acompanhe seus vídeos"
        action={
          <label className="rs-primary" htmlFor="video-upload">
            + Novo vídeo
          </label>
        }
      />
      <div className="rs-dropzone">
        <strong>Arraste um vídeo aqui</strong>
        <small>MP4 até 500 MB · ou cole um link</small>
        <label className="rs-primary" htmlFor="video-upload">Escolher arquivo</label>
        <input id="video-upload" type="file" accept="video/*" className="invisible" onChange={addFile} />
        {message && <p className="rs-note-msg" role="status">{message}</p>}
      </div>
      <div className="rs-cards">
        {items.map((video) => (
          <div className="rs-card video" key={video.id}>
            <button type="button" className="rs-thumb-btn" onClick={() => onOpen(video)} aria-label={`Abrir ${video.title}`}>
              <Thumb video={video} />
            </button>
            <span className={`rs-badge ${video.status === "Publicado" ? "ok" : "draft"} floating`}>{video.status}</span>
            <h3>{video.title}</h3>
            <p>{video.classes}{video.status === "Publicado" ? " · publicado" : ""}</p>
            <small>{video.status === "Publicado" ? `${video.views} visualizações` : "Não publicado"}</small>
            <button type="button" className="rs-note-btn" onClick={() => togglePublish(video.id)}>
              {video.status === "Publicado" ? "Despublicar" : "Publicar"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
