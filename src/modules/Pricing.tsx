import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Plan = {
  name: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  users: string;
  projects: string;
  storage: string;
  featured?: boolean;
  features: string[];
};

export const plans: Plan[] = [
  {
    name: "Essencial",
    description: "Para profissionais organizando seu primeiro estúdio.",
    monthlyPrice: "A definir",
    annualPrice: "A definir",
    users: "1 usuário",
    projects: "Projetos limitados",
    storage: "A definir",
    features: [
      "Workspace pessoal",
      "Projetos e acervo criativo",
      "Upload de referências",
      "Suporte da comunidade",
    ],
  },
  {
    name: "Profissional",
    description: "Para criadores que trabalham com mais intensidade.",
    monthlyPrice: "A definir",
    annualPrice: "A definir",
    users: "1 usuário",
    projects: "Projetos ampliados",
    storage: "A definir",
    featured: true,
    features: [
      "Tudo do Essencial",
      "AI Director",
      "Recursos avançados de IA",
      "Automações",
      "Suporte prioritário",
    ],
  },
  {
    name: "Estúdio",
    description: "Para equipes e agências que criam em conjunto.",
    monthlyPrice: "A definir",
    annualPrice: "A definir",
    users: "Equipe",
    projects: "Projetos ampliados",
    storage: "A definir",
    features: [
      "Tudo do Profissional",
      "Colaboração em equipe",
      "Workspaces compartilhados",
      "Gestão de permissões",
      "Suporte dedicado",
    ],
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Planos<span className="text-primary">.</span>
          </h1>
          <p>Uma estrutura flexível para o tamanho do seu estúdio.</p>
        </div>
        <span className="demo-label">VALORES CONFIGURÁVEIS</span>
      </div>

      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <p className="muted m-0 max-w-xl text-xs leading-relaxed">
          Os planos ainda estão sendo definidos. Nenhuma cobrança ou assinatura será criada nesta
          versão.
        </p>
        <div className="inline-flex rounded-md border border-border p-1">
          <Button
            size="sm"
            variant={billing === "monthly" ? "secondary" : "ghost"}
            onClick={() => setBilling("monthly")}
          >
            Mensal
          </Button>
          <Button
            size="sm"
            variant={billing === "annual" ? "secondary" : "ghost"}
            onClick={() => setBilling("annual")}
          >
            Anual
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-lg border p-6 ${
              plan.featured ? "border-primary bg-primary/5" : "border-border bg-card"
            }`}
          >
            {plan.featured && (
              <span className="mb-5 block text-xs font-semibold text-primary">MAIS COMPLETO</span>
            )}
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="mt-2 min-h-10 text-xs leading-relaxed text-muted-foreground">
              {plan.description}
            </p>
            <div className="my-6 border-y border-border py-5">
              <span className="text-2xl font-semibold">
                {billing === "monthly" ? plan.monthlyPrice : plan.annualPrice}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                {billing === "monthly" ? "/ mês" : "/ ano"}
              </span>
            </div>
            <dl className="mb-6 grid gap-3 text-xs">
              <div className="flex justify-between gap-4 border-b border-border pb-3">
                <dt className="text-muted-foreground">Usuários</dt>
                <dd className="m-0 text-right">{plan.users}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-3">
                <dt className="text-muted-foreground">Projetos</dt>
                <dd className="m-0 text-right">{plan.projects}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Armazenamento</dt>
                <dd className="m-0 text-right">{plan.storage}</dd>
              </div>
            </dl>
            <ul className="mb-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-xs">
                  <Check size={14} className="mt-0.5 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={plan.featured ? "default" : "outline"} disabled>
              Disponibilidade em breve
            </Button>
          </article>
        ))}
      </div>
    </>
  );
}
