import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { uploadAsset } from "@/lib/storage";

export function AssetUploadField({
  folder,
  currentPath,
  onUploaded,
}: {
  folder: "projects" | "references";
  currentPath: string;
  onUploaded: (path: string) => void;
}) {
  const { workspaceId } = useAuth();
  const [uploading, setUploading] = useState(false);

  async function handleFile(file?: File) {
    if (!file) return;
    if (!workspaceId) {
      toast.error("Seu workspace ainda está sendo preparado. Tente novamente.");
      return;
    }

    setUploading(true);
    try {
      const newPath = await uploadAsset(file, workspaceId, folder);
      onUploaded(newPath);
      toast.success("Imagem enviada para o armazenamento privado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="wide block text-xs">
      Enviar imagem para o GAMBO
      <input
        className="mt-2 block w-full text-sm"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={uploading || !workspaceId}
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <span className="mt-1 block text-[10px] text-white/45">
        JPG, PNG, WEBP ou GIF · até 8 MB {uploading ? "· Enviando..." : ""}
      </span>
    </label>
  );
}
