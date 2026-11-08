import { ChevronRight, Clock3, Play, X } from "lucide-react";
import { mockVideos } from "@/data/shared/social";

export function VideoCard({ video, onOpen }: { video: (typeof mockVideos)[number]; onOpen: (video: (typeof mockVideos)[number]) => void }) {
  return <button className="video-card" onClick={() => onOpen(video)}><div className={`video-thumb ${video.color}`}><span>{video.initials}</span><Play fill="currentColor" /><small><Clock3 /> {video.duration}</small></div><div className="video-info"><b>{video.title}</b><small>{video.professor}</small><span>Assistir aula <ChevronRight /></span></div></button>;
}

export function VideoModal({ video, onClose }: { video: (typeof mockVideos)[number]; onClose: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Vídeo aula"><div className="video-modal"><button className="modal-close" onClick={onClose} aria-label="Fechar"><X /></button>{video.videoUrl ? <video className="modal-video-player" controls autoPlay preload="metadata"><source src={video.videoUrl} type="video/mp4" />Seu navegador não suporta a reprodução de vídeo.</video> : <div className={`modal-video ${video.color}`}><Play fill="white" /></div>}<h2>{video.title}</h2><p>{video.professor} · {video.duration}</p>{!video.videoUrl && <button className="primary-button">Iniciar vídeo <Play fill="currentColor" /></button>}</div></div>;
}
