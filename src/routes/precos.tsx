import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/modules/Pricing";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/precos")({
  head: () =>
    pageHead(
      "Preços",
      "Compare os planos configuráveis do GAMBO para profissionais, equipes e agências.",
    ),
  component: Pricing,
});
