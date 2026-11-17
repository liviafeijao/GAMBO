export const statuses = ["Planejamento", "Em andamento", "Em revisão", "Concluído"] as const;
export type ProjectStatus = (typeof statuses)[number];

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  category: string;
  status: ProjectStatus;
  createdAt: string;
  deadline: string;
  cover: string;
}

export interface Reference {
  id: string;
  name: string;
  description: string;
  category: string;
  collection: string;
  tags: string[];
  cover: string;
}

export interface Repository<T extends { id: string }> {
  list(workspaceId: string): Promise<T[]>;
  save(item: T, workspaceId: string): Promise<void>;
  remove(id: string, workspaceId: string): Promise<void>;
}

export function validateProject(project: Project): string | null {
  if (!project.name.trim()) return "Informe o nome do projeto.";
  if (!project.client.trim()) return "Informe o cliente.";
  if (!project.description.trim()) return "Descreva o projeto.";
  if (!project.deadline) return "Selecione o prazo.";
  if (project.deadline < project.createdAt.slice(0, 10)) return "O prazo não pode ser anterior à criação.";
  if (!statuses.includes(project.status)) return "Selecione um status válido.";
  return null;
}

export function validateReference(reference: Reference): string | null {
  if (!reference.name.trim()) return "Informe o nome da referência.";
  if (!reference.collection.trim()) return "Informe uma coleção.";
  if (!reference.category.trim()) return "Informe uma categoria.";
  return null;
}
