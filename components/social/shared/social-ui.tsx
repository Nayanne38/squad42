import type { ReactNode } from "react";

export function Avatar({
  initials,
  color = "blue",
  online = false,
}: {
  initials: string;
  color?: string;
  online?: boolean;
}) {
  return (
    <span className={`social-avatar ${color}`}>
      {initials}
      {online && <i />}
    </span>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="social-badge">{children}</span>;
}

export function PageIntro({ title, text }: { title: string; text: string }) {
  return (
    <div className="social-heading">
      <Badge>Rede Social Escolar</Badge>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
