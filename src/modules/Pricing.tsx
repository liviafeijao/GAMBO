import { Check, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DEMO_PRICING_PLANS = [
  {
    id: "starter",
    name: "GAMBO Starter",
    description: "Para profissionais independentes que desejam organizar seu processo criativo.",
    monthlyPrice: 29.9,
    featured: false,
    features: [
      "Acesso ao ambiente GAMBO",
      "Organização de projetos",
      "Ferramentas criativas básicas",
      "IA Director com limite demonstrativo",
      "Biblioteca de referências",
    ],
  },
  {
    id: "studio",
    name: "GAMBO Studio",
    description: "Para profissionais criativos, pequenos estúdios e equipes em crescimento.",
    monthlyPrice: 59.9,
    featured: true,
    features: [
      "Todos os recursos do Starter",
      "Mais projetos ativos",
      "Maior limite demonstrativo do IA Director",
      "Organização avançada de projetos",
      "Recursos adicionais de criação e planejamento",
      "Biblioteca ampliada",
    ],
  },
  {
    id: "agency",
    name: "GAMBO Agency",
    description: "Para estúdios e agências que precisam organizar fluxos criativos mais amplos.",
    monthlyPrice: 99.9,
    featured: false,
    features: [
      "Todos os recursos do Studio",
      "Limites demonstrativos ampliados",
      "Recursos avançados de organização",
      "Ferramentas para fluxos de equipe",
      "Recursos adicionais de gestão criativa",
    ],
  },
] as const;

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function Pricing() {
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Planos<span className="text-primary">.</span>
          </h1>
          <p>Uma visão demonstrativa de como o GAMBO pode acompanhar seu estúdio.</p>
        </div>
        <span className="demo-label">APENAS DEMONSTRATIVO</span>
      </div>

      <p className="pricing-disclaimer" role="note">
        Valores e funcionalidades apresentados apenas para fins demonstrativos. Os planos comerciais
        ainda não estão disponíveis.
      </p>

      <div className="pricing-grid">
        {DEMO_PRICING_PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`pricing-card ${plan.featured ? "featured" : ""}`}
            aria-label={plan.name}
          >
            {plan.featured && (
              <span className="pricing-recommended">
                <Crown size={13} /> Recomendado
              </span>
            )}
            <div className="pricing-card-heading">
              <div>
                <p className="mono text-primary">PLANO DEMONSTRATIVO</p>
                <h2>{plan.name}</h2>
              </div>
              {plan.featured && <Sparkles size={20} className="text-primary" />}
            </div>
            <p className="pricing-description">{plan.description}</p>
            <div className="pricing-price">
              <strong>{formatPrice(plan.monthlyPrice)}</strong>
              <span>/ mês</span>
            </div>
            <ul className="pricing-features">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={15} aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button type="button" className="pricing-button" variant="outline" disabled>
              Em breve · Plano demonstrativo
            </Button>
          </article>
        ))}
      </div>
    </>
  );
}
