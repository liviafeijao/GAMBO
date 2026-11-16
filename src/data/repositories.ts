import type {Project,Reference,Repository} from '@/domain/models';
import objects from '@/assets/project-objects.jpg';
import botanical from '@/assets/project-botanical.jpg';
import architecture from '@/assets/project-architecture.jpg';
export const covers = [objects,botanical,architecture] as const;
const projectSeed:Project[] = [
{id:'p1',name:'Forma — Identidade visual',description:'Uma nova expressão de marca através de formas, contrastes e possibilidades.',client:'Forma Studio',category:'Branding',status:'Em andamento',createdAt:'2026-11-02',deadline:'2026-11-28',cover:objects},
{id:'p2',name:'Botânica — Campanha',description:'Direção de arte para uma linha de cuidado que conecta natureza e ciência.',client:'Botânica',category:'Direção de arte',status:'Em revisão',createdAt:'2026-11-04',deadline:'2026-11-24',cover:botanical},
{id:'p3',name:'Átrio — Universo de marca',description:'Arquitetura, luz e matéria como ponto de partida para uma identidade atemporal.',client:'Átrio Arquitetura',category:'Branding',status:'Planejamento',createdAt:'2026-11-10',deadline:'2026-12-08',cover:architecture}];
const referenceSeed:Reference[] = [
{id:'r1',name:'Geometria em equilíbrio',description:'Volumes, contrastes e materialidade em uma composição editorial.',category:'3D & Objetos',collection:'Forma & Matéria',tags:['geometria','cromo','editorial'],cover:objects},
{id:'r2',name:'Natureza como linguagem',description:'Texturas orgânicas e direção de arte para produtos botânicos.',category:'Fotografia',collection:'Natureza',tags:['botânica','produto','verde'],cover:botanical},
{id:'r3',name:'O espaço entre as formas',description:'Estudo de luz e curvas na arquitetura contemporânea.',category:'Arquitetura',collection:'Forma & Matéria',tags:['arquitetura','concreto','luz'],cover:architecture}];
class LocalRepository<T extends {id:string}> implements Repository<T> {
 constructor(private key:string,private seed:T[]){}
 list():T[] { if(typeof window==='undefined') return this.seed; const raw=window.localStorage.getItem(this.key); if(!raw) return this.seed; try {const parsed:unknown=JSON.parse(raw); if(!Array.isArray(parsed)||!parsed.every(item=>typeof item==='object'&&item!==null&&'id' in item)) throw new Error('Dados locais inválidos'); return parsed as T[];} catch {throw new Error('Não foi possível ler os dados locais.');} }
 save(item:T) { const items=this.list(); const index=items.findIndex(x=>x.id===item.id); if(index<0) items.unshift(item); else items[index]=item; window.localStorage.setItem(this.key,JSON.stringify(items)); }
 remove(id:string) {window.localStorage.setItem(this.key,JSON.stringify(this.list().filter(x=>x.id!==id)));}
}
export const projectsRepository:Repository<Project> = new LocalRepository('gambo.projects.v1',projectSeed);
export const referencesRepository:Repository<Reference> = new LocalRepository('gambo.references.v1',referenceSeed);
export const settingsRepository = {get(){try{return JSON.parse(window.localStorage.getItem('gambo.settings')||'{}') as {name?:string;workspace?:string};}catch{return {}}},save(value:{name:string;workspace:string}){window.localStorage.setItem('gambo.settings',JSON.stringify(value));}};
