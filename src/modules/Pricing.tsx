import { useEffect, useState } from "react";
import { Check, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

type PricingPlan = {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthly_price: number | string;
  annual_price: number | string;
  currency: string;
  features: string[];
  limits: Record<string, number>;
  included_users: number;
  is_free: boolean;
  is_featured: boolean;
  display_order: number;
};

function formatPrice(value: number | string) {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function Pricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured()) {
      setLoading(false);
      setError("Configure as variáveis públicas do Supabase para consultar os planos.");
      return () => {
        active = false;
      };
    }

    getSupabaseClient()
      .from("pricing_plans")
      .select(
        "id,name,slug,description,monthly_price,annual_price,currency,features,limits,included_users,is_free,is_featured,display_order",
      )
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setError("Não foi possível carregar os planos comerciais.");
          return;
        }
        setPlans((data ?? []) as PricingPlan[]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Planos<span className="text-primary">.</span>
          </h1>
          <p>Escolha o espaço certo para o ritmo do seu estúdio.</p>
        </div>
        <span className="demo-label">PREÇOS ILustrativos</span>
      </div>

      <p className="muted mb-7 max-w-2xl text-xs leading-relaxed">
        Valores e limites desta página são fictícios, destinados à demonstração acadêmica. Nenhuma
        cobrança ou assinatura é realizada.
      </p>

      {error && (
        <p role="alert" className="form-error mb-6">
          {error}
        </p>
      )}

      {loading ? (
        <div className="empty">Carregando planos…</div>
      ) : plans.length ? (
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`relative rounded-2xl border p-6 ${plan.is_featured ? "border-primary bg-card shadow-lg" : "border-border bg-card"}`}
            >
              {plan.is_featured && (
                <span className="absolute -top-3 left-6 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground">
                  <Crown size={12} /> Recomendado
                </span>
              )}
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="mono mb-2 text-[10px] text-primary">
                    {plan.is_free ? "ENTRADA" : plan.is_featured ? "PROFISSIONAL" : "AVANÇADO"}
                  </p>
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                </div>
                {plan.is_featured ? <Sparkles size={20} className="text-primary" /> : null}
              </div>
              <p className="min-h-12 text-xs leading-relaxed text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-6 border-y border-border py-5">
                <strong className="text-3xl">{formatPrice(plan.monthly_price)}</strong>
                <span className="muted text-xs"> / mês</span>
                {!plan.is_free && (
                  <p className="muted mt-1 text-[10px]">
                    ou {formatPrice(plan.annual_price)} por ano
                  </p>
                )}
              </div>
              <ul className="mt-5 space-y-3 text-xs">
                {(plan.features ?? []).map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={14} className="mt-0.5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="muted mt-5 text-[10px]">
                Até {plan.included_users} usuário{plan.included_users === 1 ? "" : "s"}
              </p>
              <Button className="mt-5 w-full" variant={plan.is_featured ? "default" : "outline"}>
                {plan.is_free ? "Começar gratuitamente" : "Ver plano demonstrativo"}
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">Nenhum plano ativo disponível.</div>
      )}
    </>
  );
}
