import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/modules/Pricing";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/precos")({
  head: () =>
    pageHead(
      "Preços",
      "Compare os planos fictícios do GAMBO, sem disponibilidade comercial ou cobrança.",
    ),
  component: Pricing,
});
