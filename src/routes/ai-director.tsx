import { createFileRoute } from "@tanstack/react-router";
import { Director } from "@/modules/Director";
import { pageHead } from "@/lib/metadata";
export const Route = createFileRoute("/ai-director")({
  head: () =>
    pageHead(
      "AI Director",
      "Converse com o IA Director para desenvolver conceitos, briefings e direções criativas no GAMBO.",
    ),
  component: Director,
});
