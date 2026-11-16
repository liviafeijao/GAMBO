import {createFileRoute} from '@tanstack/react-router';
import {SettingsPage} from '@/modules/OtherPages';
import {pageHead} from '@/lib/metadata';
export const Route=createFileRoute('/configuracoes')({head:()=>pageHead('Configurações','Gerencie suas preferências locais e seu workspace GAMBO.'),component:SettingsPage});
