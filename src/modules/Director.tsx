import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowUp,
  Bookmark,
  BookmarkCheck,
  LoaderCircle,
  Moon,
  Orbit,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageResponse } from "@/components/ai-elements/message";
import { useTheme } from "@/contexts/theme-context";
import { useDirector } from "@/viewmodels/useDirector";

const starters = [
  "Quero encontrar um conceito forte para este projeto.",
  "Ajude a transformar este briefing em uma direção visual.",
  "Como posso iluminar esta cena com os recursos que tenho?",
];

export function Director() {
  const { theme, setTheme } = useTheme();
  const {
    messages,
    conversation,
    conversations,
    busy,
    error,
    canRetry,
    ideas,
    projects,
    projectsLoading,
    projectsError,
    loaded,
    send,
    retryLast,
    startConversation,
    openHistory,
    selectProject,
    saveIdea,
  } = useDirector();
  const [input, setInput] = useState("");
  const messageEnd = useRef<HTMLDivElement>(null);
  const selectedProject = projects.find((project) => project.id === conversation?.projectId);

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && !busy) {
      event.preventDefault();
      void send(input);
      setInput("");
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            IA Director<span className="text-primary">.</span>
          </h1>
          <p>Direção criativa para transformar ideias em caminhos possíveis.</p>
        </div>
        <div className="director-heading-actions">
          <div className="director-theme-toggle" role="group" aria-label="Modo visual">
            <Button
              type="button"
              variant={theme === "dark" ? "secondary" : "ghost"}
              aria-pressed={theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              <Moon />
              Dark
            </Button>
            <Button
              type="button"
              variant={theme === "clean" ? "secondary" : "ghost"}
              aria-pressed={theme === "clean"}
              onClick={() => setTheme("clean")}
            >
              <Sun />
              Clean
            </Button>
          </div>
          <Button variant="outline" onClick={() => startConversation()}>
            <Plus />
            Nova conversa
          </Button>
        </div>
      </div>
      <div className="chat-layout director-layout">
        <aside className="chat-history">
          <h3>Conversas do estúdio</h3>
          <Button variant="outline" className="history-button" onClick={() => startConversation()}>
            <Plus />
            Nova conversa
          </Button>
          <div className="director-history-list">
            {conversations.map((item) => (
              <Button
                variant={item.id === conversation?.id ? "secondary" : "ghost"}
                className="history-button"
                key={item.id}
                onClick={() => openHistory(item.id)}
              >
                <span className="director-history-title">{item.title}</span>
                {item.projectId && <span className="director-history-context">Projeto</span>}
              </Button>
            ))}
          </div>
          <h3 className="mt-8">
            Ideias salvas <span className="text-primary">{ideas.length}</span>
          </h3>
          {ideas.length ? (
            <div className="director-saved-ideas">
              {ideas.map((idea, index) => (
                <p className="text-xs muted leading-relaxed" key={`${index}-${idea.slice(0, 24)}`}>
                  {index + 1}. {idea}
                </p>
              ))}
            </div>
          ) : (
            <p className="muted text-xs leading-relaxed">
              Salve respostas úteis para encontrá-las novamente aqui.
            </p>
          )}
        </aside>
        <section className="chat-main director-main">
          <div className="director-toolbar">
            <div className="flex items-center gap-2 text-primary">
              <Orbit size={19} />
              <span className="text-xs">Direção criativa / Estúdio GAMBO</span>
            </div>
            <label className="director-project-select">
              <span>Contexto</span>
              <select
                aria-label="Modo de conversa"
                value={conversation?.projectId ?? ""}
                disabled={!loaded || projectsLoading || !conversation}
                onChange={(event) => selectProject(event.target.value || null)}
              >
                <option value="">Modo livre</option>
                {selectedProject && (
                  <option value={selectedProject.id}>{selectedProject.name}</option>
                )}
                {projects
                  .filter((project) => project.id !== conversation?.projectId)
                  .map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} · {project.category}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          {projectsError && (
            <p role="status" className="director-inline-notice">
              {projectsError}
            </p>
          )}
          {selectedProject && (
            <div className="director-project-context" aria-live="polite">
              <span className="mono">CONVERSA NO PROJETO</span>
              <strong>{selectedProject.name}</strong>
              <span>
                {selectedProject.category} · {selectedProject.client} · {selectedProject.status}
              </span>
            </div>
          )}
          <div className="messages director-messages" aria-live="polite" aria-busy={busy}>
            {messages.length === 0 && (
              <div className="director-empty">
                <span className="director-empty-icon">
                  <Sparkles size={20} />
                </span>
                <h2>Qual ideia vamos desenvolver?</h2>
                <p>
                  Compartilhe um desafio, uma referência ou um briefing. Você pode conversar
                  livremente ou escolher um projeto para dar contexto à direção.
                </p>
                <div className="director-starters">
                  {starters.map((starter) => (
                    <button
                      type="button"
                      key={starter}
                      disabled={busy || !loaded}
                      onClick={() => void send(starter)}
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div className={`message ${message.role}`} key={message.id}>
                <MessageResponse className="director-response">{message.text}</MessageResponse>
                {message.role === "assistant" && (
                  <div className="director-message-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveIdea(message.text)}
                      disabled={ideas.includes(message.text)}
                    >
                      {ideas.includes(message.text) ? <BookmarkCheck /> : <Bookmark />}
                      {ideas.includes(message.text) ? "Ideia salva" : "Salvar ideia"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {busy && (
              <div className="director-loading" role="status">
                <LoaderCircle size={15} className="director-spinner" />
                <span>Preparando uma direção criativa…</span>
              </div>
            )}
            <div ref={messageEnd} />
          </div>
          {error && (
            <div className="director-error" role="alert">
              <span>{error}</span>
              {canRetry && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => void retryLast()}
                >
                  <RotateCcw />
                  Tentar novamente
                </Button>
              )}
            </div>
          )}
          <form
            className="chat-form director-chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
              setInput("");
            }}
          >
            <textarea
              aria-label="Ideia ou briefing"
              maxLength={4_000}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedProject
                  ? `Converse sobre ${selectedProject.name}…`
                  : "Descreva uma ideia ou compartilhe um briefing…"
              }
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Enviar mensagem"
              disabled={busy || !input.trim() || !loaded}
            >
              <ArrowUp />
            </Button>
          </form>
          <p className="mono director-footnote">Conversas e ideias salvas ficam neste navegador.</p>
          {messages.length > 0 && (
            <div className="section-title mt-8">
              <h2>Pontos de partida</h2>
            </div>
          )}
          {messages.length > 0 && (
            <div className="tool-grid director-starter-grid">
              {starters.map((starter) => (
                <button
                  className="director-starter-card"
                  key={starter}
                  type="button"
                  disabled={busy}
                  onClick={() => void send(starter)}
                >
                  {starter}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
