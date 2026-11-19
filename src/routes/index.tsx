import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/modules/Dashboard";
import { pageHead } from "@/lib/metadata";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Início",
      "GAMBO: seu ambiente de tecnologia criativa. Projetos, referências e ferramentas em um só estúdio.",
    ),
  component: Dashboard,
});
