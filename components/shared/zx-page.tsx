"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/** Moldura das telas internas (perfil, turmas, cadastros etc.) com cabeçalho e botão de voltar. */
export function ZxPage({
  role,
  eyebrow,
  title,
  subtitle,
  backHref,
  backLabel = "← Voltar ao dashboard",
  children,
}: {
  role: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
}) {
  return (
    <main className="zx-page">
      <header className="zx-header">
        <Link href={backHref ?? `/${role}`} className="zx-back">
          {backLabel}
        </Link>
        <span>ZENIX EDUCATION</span>
      </header>
      <section className="zx-welcome">
        <small>{eyebrow}</small>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </section>
      <section className="zx-content">{children}</section>
    </main>
  );
}
