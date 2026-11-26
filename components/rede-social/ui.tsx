"use client";

import type { ReactNode } from "react";
import {
  AtSign,
  ChartColumn,
  CircleHelp,
  Megaphone,
  MessageSquare,
  Monitor,
  Play,
  ShieldCheck,
  Smile,
  User,
  Users,
  X,
} from "lucide-react";

const icons = {
  feed: AtSign,
  video: Play,
  mural: Monitor,
  groups: Users,
  chat: MessageSquare,
  hobby: Smile,
  profile: User,
  megaphone: Megaphone,
  shield: ShieldCheck,
  chart: ChartColumn,
  help: CircleHelp,
} as const;

export function NavIcon({ name }: { name: string }) {
  const Icon = icons[name as keyof typeof icons] ?? AtSign;
  return <Icon size={16} />;
}

export function PageHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rs-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Pills<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="rs-pills" role="tablist" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={value === option}
          className={value === option ? "active" : ""}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "green",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "green" | "indigo" | "gold" | "red";
}) {
  return (
    <div className={`rs-stat tone-${tone}`}>
      <small>{label}</small>
      <strong>{value}</strong>
      {hint && <span>{hint}</span>}
    </div>
  );
}

export function Bar({ value, tone = "green" }: { value: number; tone?: string }) {
  return (
    <div className="rs-bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <i className={`tone-${tone}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function barTone(value: number) {
  if (value >= 80) return "indigo";
  if (value >= 65) return "green";
  if (value >= 55) return "gold";
  return "red";
}

export function Circle({ text, size = 40 }: { text?: string; size?: number }) {
  return (
    <span className="rs-circle" style={{ width: size, height: size }}>
      {text}
    </span>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rs-modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="rs-modal">
        <div className="rs-modal-head">
          <strong>{title}</strong>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>
        <div className="rs-modal-body">{children}</div>
      </div>
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      className="rs-search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
    />
  );
}
