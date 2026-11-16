import {createFileRoute} from '@tanstack/react-router';
import {Bmt} from '@/modules/OtherPages';
import {pageHead} from '@/lib/metadata';
export const Route=createFileRoute('/bmt-prompt-studio')({head:()=>pageHead('BMT Prompt Studio','Área reservada para incorporar o BMT Prompt Studio original ao GAMBO.'),component:Bmt});
