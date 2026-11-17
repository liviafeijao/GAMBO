import { useEffect, useState } from "react";
import { createAssetUrl } from "@/lib/storage";

export function useAssetUrl(path: string) {
  const [url, setUrl] = useState(path);

  useEffect(() => {
    let active = true;
    setUrl(path);
    createAssetUrl(path)
      .then((signedUrl) => {
        if (active) setUrl(signedUrl);
      })
      .catch((error: unknown) => {
        console.error("Não foi possível carregar a imagem do GAMBO:", error);
        if (active) setUrl("");
      });
    return () => {
      active = false;
    };
  }, [path]);

  return url;
}
