import type { Project, Reference, Repository } from "@/domain/models";
import objects from "@/assets/project-objects.jpg";
import botanical from "@/assets/project-botanical.jpg";
import architecture from "@/assets/project-architecture.jpg";
import { getSupabaseClient } from "@/lib/supabase";
import { isStoredAsset, removeAsset } from "@/lib/storage";

export const covers = [objects, botanical, architecture] as const;

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
};

type ReferenceRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  cover_url: string | null;
  collections: { name: string } | null;
};

const projectsRepository: Repository<Project> = {
  async list(workspaceId) {
    const { data, error } = await getSupabaseClient()
      .from("projects")
      .select("id,name,description,client,category,status,created_on,deadline,cover_url")
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
      cover: row.cover_url || covers[0],
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
      collection: row.collections?.name ?? "Geral",
      tags: row.tags ?? [],
      cover: row.cover_url || covers[0],
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
