import { createFileRoute } from "@tanstack/react-router";
import { Library } from "@/modules/Library";
import { pageHead } from "@/lib/metadata";
export const Route = createFileRoute("/acervo-criativo")({
  head: () =>
    pageHead(
      "Acervo Criativo",
      "Referências, coleções e repertório visual para os seus projetos no GAMBO.",
    ),
  component: Library,
});
