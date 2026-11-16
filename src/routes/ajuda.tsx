import {createFileRoute} from '@tanstack/react-router';
import {Help} from '@/modules/OtherPages';
import {pageHead} from '@/lib/metadata';
export const Route=createFileRoute('/ajuda')({head:()=>pageHead('Ajuda & suporte','Informações sobre dados locais e experiências demonstrativas do GAMBO.'),component:Help});
