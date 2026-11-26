"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";

const PREFIX = "zenix-rs:";

/** useState que guarda o valor no localStorage (demonstração). Começa com o padrão e carrega o salvo após montar. */
export function usePersisted<T>(key: string, initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const fullKey = PREFIX + key;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(fullKey);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignora dados inválidos */
    }
    setReady(true);
  }, [fullKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      // blob: (anexos locais) não sobrevive ao recarregar, então não é salvo.
      localStorage.setItem(fullKey, JSON.stringify(value, (_k, v) => (typeof v === "string" && v.startsWith("blob:") ? undefined : v)));
    } catch {
      /* armazenamento cheio ou bloqueado */
    }
  }, [fullKey, value, ready]);

  return [value, setValue];
}

/** Apaga tudo o que a demonstração guardou no navegador. */
export function resetDemoData() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX) || k.startsWith("zenix-"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* sem acesso ao armazenamento */
  }
}

export function useResetDemo() {
  return useCallback(() => {
    resetDemoData();
    window.location.reload();
  }, []);
}
