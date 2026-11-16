export const statuses = ['Planejamento', 'Em andamento', 'Em revisão', 'Concluído'] as const;
export type ProjectStatus = typeof statuses[number];
export interface Project { id:string; name:string; description:string; client:string; category:string; status:ProjectStatus; createdAt:string; deadline:string; cover:string }
export interface Reference { id:string; name:string; description:string; category:string; collection:string; tags:string[]; cover:string }
export interface Repository<T extends {id:string}> { list():T[]; save(item:T):void; remove(id:string):void }
export function validateProject(p:Project):string | null { if(!p.name.trim()) return 'Informe o nome do projeto.'; if(!p.client.trim()) return 'Informe o cliente.'; if(!p.description.trim()) return 'Descreva o projeto.'; if(!p.deadline) return 'Selecione o prazo.'; if(p.deadline < p.createdAt.slice(0,10)) return 'O prazo não pode ser anterior à criação.'; if(!statuses.includes(p.status)) return 'Selecione um status válido.'; return null; }
export function validateReference(r:Reference):string | null { if(!r.name.trim()) return 'Informe o nome da referência.'; if(!r.collection.trim()) return 'Informe uma coleção.'; if(!r.category.trim()) return 'Informe uma categoria.'; return null; }
