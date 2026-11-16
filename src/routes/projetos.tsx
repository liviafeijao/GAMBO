import {createFileRoute} from '@tanstack/react-router';
import {Projects} from '@/modules/Projects';
import {pageHead} from '@/lib/metadata';
export const Route=createFileRoute('/projetos')({validateSearch:(search:Record<string,unknown>):{q?:string}=>({q:typeof search['q']==='string'?search['q']:''}),head:()=>pageHead('Projetos','Organize projetos criativos, clientes, prazos e processos no GAMBO.'),component:ProjectsRoute});
function ProjectsRoute(){const {q}=Route.useSearch();return <Projects key={q} initialQuery={q ?? ''}/>}
