import type { Project, Reference, Repository } from "@/domain/models";
import objects from "@/assets/project-objects.jpg";
import botanical from "@/assets/project-botanical.jpg";
import architecture from "@/assets/project-architecture.jpg";
import sculpture from "@/assets/gambo-sculpture.jpg";
import { getSupabaseClient } from "@/lib/supabase";
import { isStoredAsset, removeAsset } from "@/lib/storage";

const unsplash = (photo: string) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=640&q=80`;

export const coverGroups = [
  {
    name: "Fotografia",
    options: [
      { name: "Retratos", cover: unsplash("photo-1534528741775-53994a69daeb") },
      { name: "Fotografia de Produtos", cover: unsplash("photo-1542291026-7eec264c27ff") },
      { name: "Moda e Editorial", cover: unsplash("photo-1529139574466-a303027c1d8b") },
      { name: "Gastronomia", cover: unsplash("photo-1504674900247-0877df9cc836") },
      { name: "Arquitetura e Interiores", cover: unsplash("photo-1600210492486-724fe5c67fb0") },
      { name: "Lifestyle", cover: unsplash("photo-1524504388940-b1c1722653e1") },
      { name: "Fotografia Publicitária", cover: unsplash("photo-1541643600914-78b084683601") },
      { name: "Natureza e Paisagens", cover: unsplash("photo-1470770841072-f978cf4d019e") },
    ],
  },
  {
    name: "Audiovisual e Vídeo",
    options: [
      { name: "Cinema e Cinematografia", cover: unsplash("photo-1489599849927-2ee91cede3ba") },
      { name: "Filmes Publicitários", cover: unsplash("photo-1485846234645-a62644f84728") },
      { name: "Vídeos Institucionais", cover: unsplash("photo-1521737711867-e3b97375f902") },
      { name: "Conteúdo para Redes Sociais", cover: unsplash("photo-1611162617474-5b21e879e113") },
      { name: "Videoclipes", cover: unsplash("photo-1516280440614-37939bbacd81") },
      { name: "Documentários", cover: unsplash("photo-1500530855697-b586d89ba3ee") },
      { name: "Motion Design", cover: unsplash("photo-1541701494587-cb58502866ab") },
      { name: "Produção de Conteúdo", cover: unsplash("photo-1516035069371-29a1b244cc32") },
    ],
  },
  {
    name: "Design e Comunicação Visual",
    options: [
      { name: "Design Gráfico", cover: unsplash("photo-1507238691740-187a5b1d37b8") },
      { name: "Identidade Visual", cover: unsplash("photo-1545235617-9465d2a55698") },
      { name: "Tipografia", cover: unsplash("photo-1509223197845-458d87318791") },
      { name: "Design Editorial", cover: unsplash("photo-1544947950-fa07a98d237f") },
      { name: "Embalagens e Packaging", cover: unsplash("photo-1602143407151-7111542de6e8") },
      { name: "Ilustração", cover: unsplash("photo-1513364776144-60967b0f800f") },
      { name: "Design Digital e Interfaces", cover: unsplash("photo-1551650975-87deedd944c3") },
      {
        name: "Composição e Experimentação Visual",
        cover: unsplash("photo-1549490349-8643362247b5"),
      },
    ],
  },
  {
    name: "Arte, Conceito e Estética",
    options: [
      { name: "Formas e Objetos", cover: objects },
      { name: "Botânica", cover: botanical },
      { name: "Arquitetura", cover: architecture },
      { name: "Arte Abstrata", cover: sculpture },
      { name: "Geometria", cover: unsplash("photo-1518005020951-eccb494ad742") },
      { name: "Texturas e Materiais", cover: unsplash("photo-1518837695005-2083093ee35b") },
      { name: "Minimalismo", cover: unsplash("photo-1494438639946-1ebd1d20bf85") },
      { name: "Composições Orgânicas", cover: unsplash("photo-1490750967868-88aa4486c946") },
    ],
  },
] as const;

export const defaultCover = objects;
export const covers = coverGroups.flatMap((group) => group.options.map((option) => option.cover));

type ProjectRow = {
  id: string;
  name: string;
  description: string;
  client: string;
  category: string;
  status: Project["status"];
  created_on: string;
  deadline: string | null;
  cover_url: string | null;
  is_demo?: boolean;
  priority?: string;
  start_date?: string;
  briefing?: Record<string, unknown> | null;
};

type ReferenceRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  cover_url: string | null;
  collections: { name: string }[] | null;
};

const projectsRepository: Repository<Project> = {
  async list(workspaceId) {
    const { data, error } = await getSupabaseClient()
      .from("projects")
      .select(
        "id,name,description,client,category,status,created_on,deadline,cover_url,is_demo,priority,start_date,briefing",
      )
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: ProjectRow) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? "",
      client: row.client ?? "",
      category: row.category ?? "",
      status: row.status,
      createdAt: row.created_on,
      deadline: row.deadline ?? "",
      cover: row.cover_url || defaultCover,
      isDemo: row.is_demo === true,
      ...(row.priority ? { priority: row.priority } : {}),
      ...(row.start_date
        ? { startDate: row.start_date }
        : row.created_on
          ? { startDate: row.created_on }
          : {}),
      ...(row.briefing ? { briefing: row.briefing } : {}),
    }));
  },

  async save(project, workspaceId) {
    const supabase = getSupabaseClient();
    const { data: previous, error: lookupError } = await supabase
      .from("projects")
      .select("cover_url")
      .eq("id", project.id)
      .eq("workspace_id", workspaceId)
      .maybeSingle();
    if (lookupError) throw lookupError;

    const { error } = await supabase.from("projects").upsert({
      id: project.id,
      workspace_id: workspaceId,
      name: project.name,
      description: project.description,
      client: project.client,
      category: project.category,
      status: project.status,
      created_on: project.createdAt,
      deadline: project.deadline || null,
      cover_url: project.cover,
      is_demo: project.isDemo ?? false,
      priority: project.priority ?? null,
      start_date: project.startDate || null,
      briefing: project.briefing ?? null,
    });
    if (error) throw error;

    if (
      previous?.cover_url &&
      previous.cover_url !== project.cover &&
      isStoredAsset(previous.cover_url)
    ) {
      try {
        await removeAsset(previous.cover_url);
      } catch (cleanupError) {
        console.error("O registro foi salvo, mas a capa antiga não foi removida:", cleanupError);
      }
    }
  },

  async remove(id, workspaceId) {
    const supabase = getSupabaseClient();
    const { data: previous, error: lookupError } = await supabase
      .from("projects")
      .select("cover_url")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .maybeSingle();
    if (lookupError) throw lookupError;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("workspace_id", workspaceId);
    if (error) throw error;
    if (previous?.cover_url && isStoredAsset(previous.cover_url)) {
      try {
        await removeAsset(previous.cover_url);
      } catch (cleanupError) {
        console.error("O projeto foi excluído, mas a capa não foi removida:", cleanupError);
      }
    }
  },
};

const referencesRepository: Repository<Reference> = {
  async list(workspaceId) {
    const { data, error } = await getSupabaseClient()
      .from("creative_references")
      .select("id,name,description,category,tags,cover_url,collections(name)")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row: ReferenceRow) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? "",
      category: row.category ?? "",
      collection: row.collections?.[0]?.name ?? "Geral",
      tags: row.tags ?? [],
      cover: row.cover_url || defaultCover,
    }));
  },

  async save(reference, workspaceId) {
    const supabase = getSupabaseClient();
    const { data: previous, error: lookupError } = await supabase
      .from("creative_references")
      .select("cover_url")
      .eq("id", reference.id)
      .eq("workspace_id", workspaceId)
      .maybeSingle();
    if (lookupError) throw lookupError;

    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .upsert(
        { workspace_id: workspaceId, name: reference.collection.trim(), description: "" },
        { onConflict: "workspace_id,name" },
      )
      .select("id")
      .single();
    if (collectionError) throw collectionError;
    const collectionId = collection.id as string;

    const { error } = await supabase.from("creative_references").upsert({
      id: reference.id,
      workspace_id: workspaceId,
      collection_id: collectionId,
      name: reference.name,
      description: reference.description,
      category: reference.category,
      tags: reference.tags.map((tag) => tag.trim()).filter(Boolean),
      cover_url: reference.cover,
    });
    if (error) throw error;

    if (
      previous?.cover_url &&
      previous.cover_url !== reference.cover &&
      isStoredAsset(previous.cover_url)
    ) {
      try {
        await removeAsset(previous.cover_url);
      } catch (cleanupError) {
        console.error(
          "A referência foi salva, mas a imagem antiga não foi removida:",
          cleanupError,
        );
      }
    }
  },

  async remove(id, workspaceId) {
    const supabase = getSupabaseClient();
    const { data: previous, error: lookupError } = await supabase
      .from("creative_references")
      .select("cover_url")
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .maybeSingle();
    if (lookupError) throw lookupError;

    const { error } = await supabase
      .from("creative_references")
      .delete()
      .eq("id", id)
      .eq("workspace_id", workspaceId);
    if (error) throw error;
    if (previous?.cover_url && isStoredAsset(previous.cover_url)) {
      try {
        await removeAsset(previous.cover_url);
      } catch (cleanupError) {
        console.error("A referência foi excluída, mas a imagem não foi removida:", cleanupError);
      }
    }
  },
};

export { projectsRepository, referencesRepository };

export const settingsRepository = {
  get() {
    try {
      return JSON.parse(window.localStorage.getItem("gambo.settings") || "{}") as {
        name?: string;
        workspace?: string;
      };
    } catch {
      return {};
    }
  },
  save(value: { name: string; workspace: string }) {
    window.localStorage.setItem("gambo.settings", JSON.stringify(value));
  },
};
