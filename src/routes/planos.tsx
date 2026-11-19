import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/modules/Pricing";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/planos")({
  head: () =>
    pageHead("Planos", "Planos comerciais ilustrativos do GAMBO consultados no Supabase."),
  component: Pricing,
});
