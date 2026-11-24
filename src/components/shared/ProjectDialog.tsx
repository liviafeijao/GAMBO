import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { projectCategories, statuses, validateProject, type Project } from "@/domain/models";
import { defaultCover } from "@/data/repositories";
import { CoverPicker } from "@/components/shared/CoverPicker";
import { AssetUploadField } from "@/components/shared/AssetUploadField";
import { useAssetUrl } from "@/hooks/useAssetUrl";

export function ProjectForm({
  project,
  onClose,
  onSave,
}: {
  project?: Project;
  onClose: () => void;
  onSave: (project: Project) => void;
}) {
  const [value, setValue] = useState<Project>(
    project ?? {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      client: "",
      category: "Branding",
      status: "Planejamento",
      createdAt: new Date().toISOString().slice(0, 10),
      deadline: "",
      cover: defaultCover,
    },
  );
  const [error, setError] = useState("");
  const change = (key: keyof Project, nextValue: string) =>
    setValue((previous) => ({ ...previous, [key]: nextValue }));

  function changeCover(nextCover: string) {
    change("cover", nextCover);
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>{project ? "Editar projeto" : "Novo projeto"}</DialogTitle>
        <DialogDescription>Um novo ponto de partida para suas ideias.</DialogDescription>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const problem = validateProject(value);
            if (problem) {
              setError(problem);
              return;
            }
            onSave(value);
          }}
        >
          <div className="form-grid">
            <label className="wide">
              Nome do projeto
              <input
                autoFocus
                value={value.name}
                onChange={(event) => change("name", event.target.value)}
                placeholder="Como vamos chamar essa ideia?"
              />
            </label>
            <label>
              Cliente
              <input
                value={value.client}
                onChange={(event) => change("client", event.target.value)}
              />
            </label>
            <label>
              Categoria
              <select
                value={value.category}
                onChange={(event) => change("category", event.target.value)}
              >
                {!projectCategories.includes(
                  value.category as (typeof projectCategories)[number],
                ) &&
                  value.category && <option value={value.category}>{value.category}</option>}
                {projectCategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select
                value={value.status}
                onChange={(event) => change("status", event.target.value)}
              >
                {statuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Prazo
              <input
                type="date"
                value={value.deadline}
                onChange={(event) => change("deadline", event.target.value)}
              />
            </label>
            <label className="wide">
              Descrição
              <textarea
                value={value.description}
                onChange={(event) => change("description", event.target.value)}
                rows={3}
              />
            </label>
            <CoverPicker cover={value.cover} onChange={changeCover} />
            <AssetUploadField folder="projects" onUploaded={(path) => change("cover", path)} />
          </div>
          {error && (
            <p role="alert" className="form-error mt-4">
              {error}
            </p>
          )}
          <div className="dialog-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar projeto</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const coverUrl = useAssetUrl(project.cover);
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle>{project.name}</DialogTitle>
        <DialogDescription>
          {project.client} · {project.category}
        </DialogDescription>
        {coverUrl && <img className="detail-cover" src={coverUrl} alt={project.name} />}
        <p className="muted text-sm leading-relaxed">{project.description}</p>
        <div className="detail-meta">
          <div>
            <span>Status</span>
            <b className="status" data-status={project.status}>
              {project.status}
            </b>
          </div>
          <div>
            <span>Prazo</span>
            {project.deadline
              ? new Date(project.deadline + "T12:00:00").toLocaleDateString("pt-BR")
              : "—"}
          </div>
          <div>
            <span>Criado em</span>
            {new Date(project.createdAt + "T12:00:00").toLocaleDateString("pt-BR")}
          </div>
          <div>
            <span>Cliente</span>
            {project.client}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDelete({
  name,
  onClose,
  onConfirm,
}: {
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle>Excluir “{name}”?</DialogTitle>
        <DialogDescription>
          Esta ação não pode ser desfeita. O registro será removido do GAMBO.
        </DialogDescription>
        <div className="dialog-actions">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
