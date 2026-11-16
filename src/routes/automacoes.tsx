import {createFileRoute} from '@tanstack/react-router';
import {Automations} from '@/modules/OtherPages';
import {pageHead} from '@/lib/metadata';
export const Route=createFileRoute('/automacoes')({head:()=>pageHead('Automações','Fluxos conceituais e automações demonstrativas do estúdio GAMBO.'),component:Automations});
