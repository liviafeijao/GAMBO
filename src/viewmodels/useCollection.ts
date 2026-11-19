import { useEffect, useState, useCallback } from "react";
import type { Repository } from "@/domain/models";
import { useAuth } from "@/contexts/AuthContext";

export function useCollection<T extends { id: string }>(repository: Repository<T>) {
  const { workspaceId } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!workspaceId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setItems(await repository.list(workspaceId));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, [repository, workspaceId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(async (item: T) => {
    if (!workspaceId) {
      setError("Não foi possível identificar seu workspace.");
      return false;
    }
    try {
      await repository.save(item, workspaceId);
      await reload();
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar.");
      return false;
    }
  }, [reload, repository, workspaceId]);

  const remove = useCallback(async (id: string) => {
    if (!workspaceId) {
      setError("Não foi possível identificar seu workspace.");
      return false;
    }
    try {
      await repository.remove(id, workspaceId);
      await reload();
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível excluir.");
      return false;
    }
  }, [reload, repository, workspaceId]);

  return { items, loading, error, save, remove, reload };
}
