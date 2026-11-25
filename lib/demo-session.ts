"use client";

import { useEffect, useState } from "react";
import { readSelectedStudent, resolveStudentForRole, type Student } from "@/data/shared/school";
import { useRouter } from "next/navigation";

export const DEMO_SESSION_KEY = "zenix-demo-session";

/** Protege uma tela da sessão DEMO: só libera quando a sessão é do perfil da rota e ele é permitido. */
export function useDemoGuard(role: string, allowed: readonly string[]) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let session: string | null = null;
    try {
      session = sessionStorage.getItem(DEMO_SESSION_KEY);
    } catch {
      session = null;
    }
    if (session === role && allowed.includes(role)) {
      setAuthorized(true);
    } else {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, router]);

  return authorized;
}

/** Libera a tela quando a sessão DEMO é de qualquer um dos perfis informados (ex.: administrador também acessa a área do funcionário). */
export function useSessionIn(sessions: readonly string[]) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const key = sessions.join("|");

  useEffect(() => {
    let session: string | null = null;
    try {
      session = sessionStorage.getItem(DEMO_SESSION_KEY);
    } catch {
      session = null;
    }
    if (session && key.split("|").includes(session)) {
      setAuthorized(true);
    } else {
      router.replace("/");
    }
  }, [key, router]);

  return authorized;
}

/** Aluno exibido nas telas acadêmicas (para o responsável, o filho selecionado no dashboard). */
export function useSelectedStudent(role: string) {
  const [student, setStudent] = useState<Student>(() => resolveStudentForRole(role, null));

  useEffect(() => {
    setStudent(readSelectedStudent(role));
  }, [role]);

  return student;
}
