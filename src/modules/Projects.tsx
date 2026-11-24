import { useState } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { ProjectForm, ProjectDetail, ConfirmDelete } from "@/components/shared/ProjectDialog";
import { useCollection } from "@/viewmodels/useCollection";
import { projectsRepository } from "@/data/repositories";
import { projectCategories, statuses, type Project } from "@/domain/models";

export function Projects({ initialQuery = "" }: { initialQuery?: string }) {
  const { items, loading, error, save, remove } = useCollection(projectsRepository);
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState("Todos os status");
  const [category, setCategory] = useState("Todas as categorias");
  const [list, setList] = useState(false);
  const [form, setForm] = useState<Project | "new" | null>(null);
  const [detail, setDetail] = useState<Project | null>(null);
  const [deleted, setDeleted] = useState<Project | null>(null);

  const filtered = items.filter(
    (project) =>
      `${project.name} ${project.client} ${project.category}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (category === "Todas as categorias" || project.category === category) &&
      (status === "Todos os status" || project.status === status),
  );

  async function handleSave(project: Project) {
    if (await save(project)) {
      setForm(null);
      toast.success("Projeto salvo no Supabase.");
    }
  }

  async function handleRemove(id: string) {
    if (await remove(id)) {
      setDeleted(null);
      toast.success("Projeto excluído.");
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Projetos<span className="text-primary">.</span>
          </h1>
          <p>Ideias em movimento. Cada projeto, uma nova possibilidade.</p>
        </div>
        <Button onClick={() => setForm("new")}>
          <Plus />
          Novo projeto
        </Button>
      </div>
      <div className="filters">
        <input
          aria-label="Buscar projetos"
          placeholder="Buscar projeto, cliente ou categoria…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label="Filtrar status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {["Todos os status", ...statuses].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          aria-label="Filtrar categoria"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {[
            "Todas as categorias",
            ...new Set([
              ...projectCategories,
              ...items.map((item) => item.category).filter((item) => item.trim()),
            ]),
          ].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <div className="ml-auto flex gap-1">
          <Button
            variant={list ? "ghost" : "secondary"}
            size="icon"
            title="Visualizar em cards"
            aria-label="Visualizar em cards"
            onClick={() => setList(false)}
          >
            <LayoutGrid />
          </Button>
          <Button
            variant={list ? "secondary" : "ghost"}
            size="icon"
            title="Visualizar em lista"
            aria-label="Visualizar em lista"
            onClick={() => setList(true)}
          >
            <List />
          </Button>
        </div>
      </div>
      <div className="section-title">
        <span className="mono">{filtered.length} PROJETOS · SUPABASE</span>
      </div>
      {error ? (
        <p role="alert" className="form-error">
          {error}
        </p>
      ) : loading ? (
        <div className="empty">Carregando projetos…</div>
      ) : filtered.length ? (
        <div className={`project-grid ${list ? "projects-list" : ""}`}>
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={setDetail}
              onEdit={setForm}
              onDelete={setDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          Nenhum projeto encontrado.
          <Button
            variant="link"
            onClick={() => {
              setQuery("");
              setStatus("Todos os status");
              setCategory("Todas as categorias");
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
      {form && (
        <ProjectForm
          project={form === "new" ? undefined : form}
          onClose={() => setForm(null)}
          onSave={handleSave}
        />
      )}
      {detail && <ProjectDetail project={detail} onClose={() => setDetail(null)} />}
      {deleted && (
        <ConfirmDelete
          name={deleted.name}
          onClose={() => setDeleted(null)}
          onConfirm={() => void handleRemove(deleted.id)}
        />
      )}
    </>
  );
}
