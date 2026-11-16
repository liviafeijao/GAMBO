import {createFileRoute} from '@tanstack/react-router';
import {Director} from '@/modules/Director';
import {pageHead} from '@/lib/metadata';
export const Route=createFileRoute('/ai-director')({head:()=>pageHead('AI Director','Explore conceitos, briefings e novas direções criativas no ambiente demonstrativo do GAMBO.'),component:Director});
