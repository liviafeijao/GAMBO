import { describe, expect, it } from "vitest";
import { coverGroups, covers, defaultCover } from "@/data/repositories";

describe("Demonstration cover options", () => {
  it("includes the four requested groups with eight covers each", () => {
    expect(coverGroups.map((group) => group.name)).toEqual([
      "Fotografia",
      "Audiovisual e Vídeo",
      "Design e Comunicação Visual",
      "Arte, Conceito e Estética",
    ]);
    expect(coverGroups.flatMap((group) => group.options)).toHaveLength(32);
    expect(coverGroups.every((group) => group.options.length === 8)).toBe(true);
  });

  it("keeps all cover values unique and available to project persistence", () => {
    expect(covers).toHaveLength(32);
    expect(new Set(covers).size).toBe(covers.length);
    expect(coverGroups[3].options.slice(0, 3).map((option) => option.name)).toEqual([
      "Formas e Objetos",
      "Botânica",
      "Arquitetura",
    ]);
    expect(defaultCover).toBe(coverGroups[3].options[0].cover);
  });

  it("uses the requested names for every option", () => {
    expect(coverGroups.flatMap((group) => group.options.map((option) => option.name))).toEqual([
      "Retratos",
      "Fotografia de Produtos",
      "Moda e Editorial",
      "Gastronomia",
      "Arquitetura e Interiores",
      "Lifestyle",
      "Fotografia Publicitária",
      "Natureza e Paisagens",
      "Cinema e Cinematografia",
      "Filmes Publicitários",
      "Vídeos Institucionais",
      "Conteúdo para Redes Sociais",
      "Videoclipes",
      "Documentários",
      "Motion Design",
      "Produção de Conteúdo",
      "Design Gráfico",
      "Identidade Visual",
      "Tipografia",
      "Design Editorial",
      "Embalagens e Packaging",
      "Ilustração",
      "Design Digital e Interfaces",
      "Composição e Experimentação Visual",
      "Formas e Objetos",
      "Botânica",
      "Arquitetura",
      "Arte Abstrata",
      "Geometria",
      "Texturas e Materiais",
      "Minimalismo",
      "Composições Orgânicas",
    ]);
  });
});
