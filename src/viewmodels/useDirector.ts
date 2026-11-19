import { useState, useEffect, useRef } from "react";
export interface Message {
  role: "assistant" | "user";
  text: string;
}
export const conversations = ["Universo visual da Forma", "Campanha Botânica", "Uma nova ideia"];
export function useDirector() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Vamos explorar uma nova direção? Compartilhe uma ideia, um desafio ou um briefing.\n\nEsta conversa é uma demonstração local, sem conexão com um modelo de IA.",
    },
  ]);
  const [busy, setBusy] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  function send(text: string) {
    if (!text.trim() || busy) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setBusy(true);
    timeout.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Direção demonstrativa para “${text}”:\n\n01 — Conceito: explorar o contraste entre formas orgânicas e precisão geométrica.\n02 — Linguagem: tipografia expressiva, materiais táteis e composições com respiro.\n03 — Próximo passo: reunir referências de luz, textura e escala em um moodboard.\n\nEste é um exemplo pré-definido, não uma análise gerada por IA.`,
        },
      ]);
      setBusy(false);
    }, 650);
  }
  function openHistory(name: string) {
    if (timeout.current) clearTimeout(timeout.current);
    setBusy(false);
    setMessages([
      { role: "user", text: name },
      {
        role: "assistant",
        text: "Conversa demonstrativa do estúdio. A proposta visual explora materialidade, equilíbrio e contraste. Podemos organizar referências de objetos, natureza e arquitetura como ponto de partida.",
      },
    ]);
  }
  return {
    messages,
    busy,
    ideas,
    send,
    openHistory,
    saveIdea: (text: string) => setIdeas((prev) => (prev.includes(text) ? prev : [...prev, text])),
  };
}
