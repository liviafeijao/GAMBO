import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/modules/Pricing";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/planos")({
  head: () =>
    pageHead("Planos", "Planos e valores demonstrativos do GAMBO; indisponíveis para compra."),
  component: Pricing,
});
