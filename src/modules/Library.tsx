import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ConfirmDelete } from "@/components/shared/ProjectDialog";
import { AssetUploadField } from "@/components/shared/AssetUploadField";
import { useAssetUrl } from "@/hooks/useAssetUrl";

import { useCollection } from "@/viewmodels/useCollection";
import { covers, referencesRepository } from "@/data/repositories";
import { validateReference, type Reference } from "@/domain/models";

function ReferenceForm({
  reference,
  onClose,
  onSave,
}: {
  reference?: Reference;
  onClose: () => void;
  onSave: (reference: Reference) => void;
}) {
  const [value, setValue] = useState<Reference>(
    reference ?? {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      category: "Fotografia",
      collection: "",
      tags: [],
      cover: covers[0],
    },
  );
  const [error, setError] = useState("");

  function changeCover(nextCover: string) {
    setValue((current) => ({ ...current, cover: nextCover }));
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle>{reference ? "Editar referência" : "Nova referência"}</DialogTitle>
        <DialogDescription>Uma inspiração para o próximo movimento.</DialogDescription>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const problem = validateReference(value);
            if (problem) {
              setError(problem);
              return;
            }
            onSave(value);
          }}
        >
          <div className="form-grid">
            <label className="wide">
              Nome
              <input
                autoFocus
                value={value.name}
                onChange={(event) => setValue({ ...value, name: event.target.value })}
              />
            </label>
            <label>
              Categoria
              <input
                value={value.category}
                onChange={(event) => setValue({ ...value, category: event.target.value })}
              />
            </label>
            <label>
              Coleção
              <input
                value={value.collection}
                onChange={(event) => setValue({ ...value, collection: event.target.value })}
              />
            </label>
            <label className="wide">
              Descrição
              <textarea
                value={value.description}
                onChange={(event) => setValue({ ...value, description: event.target.value })}
              />
            </label>
            <label className="wide">
              Tags (separadas por vírgula)
              <input
                value={value.tags.join(",")}
                onChange={(event) => setValue({ ...value, tags: event.target.value.split(",") })}
              />
            </label>
            <label className="wide">
              Imagem demonstrativa
              <select value={value.cover} onChange={(event) => changeCover(event.target.value)}>
                {!covers.includes(value.cover as (typeof covers)[number]) && (
                  <option value={value.cover}>Imagem enviada</option>
                )}
                {covers.map((cover, index) => (
                  <option value={cover} key={cover}>
                    {["Formas & objetos", "Botânica", "Arquitetura"][index]}
                  </option>
                ))}
              </select>
            </label>
            <AssetUploadField
              folder="references"
              onUploaded={(path) => setValue((current) => ({ ...current, cover: path }))}
            />
          </div>
          {error && (
            <p role="alert" className="form-error mt-3">
              {error}
            </p>
          )}
          <div className="dialog-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar referência</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ReferenceCard({
  reference,
  onOpen,
  onEdit,
  onDelete,
}: {
  reference: Reference;
  onOpen: (reference: Reference) => void;
  onEdit: (reference: Reference) => void;
  onDelete: (reference: Reference) => void;
}) {
  const imageUrl = useAssetUrl(reference.cover);
  return (
    <article className="project-card reference">
      <Button
        variant="ghost"
        className="project-open"
        onClick={() => onOpen(reference)}
        aria-label={`Ver ${reference.name}`}
      >
        {imageUrl && (
          <img src={imageUrl} alt={reference.name} loading="lazy" width={1024} height={768} />
        )}
        <div className="project-info">
          <div className="flex justify-between">
            <h3>{reference.name}</h3>
            <ArrowUpRight size={15} />
          </div>
          <p>
            {reference.category} · {reference.collection}
          </p>
          <div className="tags">
            {reference.tags
              .filter((tag) => tag.trim())
              .map((tag, index) => (
                <span className="tag" key={index}>
                  {tag.trim()}
                </span>
              ))}
          </div>
        </div>
      </Button>
      <div className="card-controls">
        <Button
          variant="ghost"
          size="icon"
          title="Editar referência"
          aria-label={`Editar ${reference.name}`}
          onClick={() => onEdit(reference)}
        >
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Excluir referência"
          aria-label={`Excluir ${reference.name}`}
          onClick={() => onDelete(reference)}
        >
          <Trash2 />
        </Button>
      </div>
    </article>
  );
}

function ReferenceDetail({ reference }: { reference: Reference }) {
  const imageUrl = useAssetUrl(reference.cover);
  return (
    <>
      <DialogTitle>{reference.name}</DialogTitle>
      <DialogDescription>
        {reference.collection} · {reference.category}
      </DialogDescription>
      {imageUrl && <img className="detail-cover" src={imageUrl} alt={reference.name} />}
      <p className="muted leading-relaxed">{reference.description}</p>
      <div className="tags">
        {reference.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

export function Library() {
  const { items, loading, error, save, remove } = useCollection(referencesRepository);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas as categorias");
  const [collection, setCollection] = useState("Todas as coleções");
  const [form, setForm] = useState<Reference | "new" | null>(null);
  const [detail, setDetail] = useState<Reference | null>(null);
  const [deleted, setDeleted] = useState<Reference | null>(null);
  const filtered = items.filter(
    (reference) =>
      `${reference.name} ${reference.tags.join(" ")} ${reference.description}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (category === "Todas as categorias" || reference.category === category) &&
      (collection === "Todas as coleções" || reference.collection === collection),
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>
            Acervo Criativo<span className="text-primary">.</span>
          </h1>
          <p>Um repertório em constante construção.</p>
        </div>
        <Button onClick={() => setForm("new")}>
          <Plus />
          Nova referência
        </Button>
      </div>
      <div className="filters">
        <input
          placeholder="Buscar referências ou tags…"
          aria-label="Buscar referências"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label="Categoria"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {["Todas as categorias", ...new Set(items.map((item) => item.category))].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          aria-label="Coleção"
          value={collection}
          onChange={(event) => setCollection(event.target.value)}
        >
          {["Todas as coleções", ...new Set(items.map((item) => item.collection))].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="section-title">
        <span className="mono">{filtered.length} REFERÊNCIAS · ACERVO</span>
      </div>
      {error ? (
        <p role="alert">{error}</p>
      ) : loading ? (
        <div className="empty">Carregando acervo…</div>
      ) : filtered.length ? (
        <div className="references-grid">
          {filtered.map((reference) => (
            <ReferenceCard
              key={reference.id}
              reference={reference}
              onOpen={setDetail}
              onEdit={setForm}
              onDelete={setDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          Nenhuma referência encontrada.
          <Button
            variant="link"
            onClick={() => {
              setQuery("");
              setCategory("Todas as categorias");
              setCollection("Todas as coleções");
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
      {form && (
        <ReferenceForm
          reference={form === "new" ? undefined : form}
          onClose={() => setForm(null)}
          onSave={async (item) => {
            if (await save(item)) {
              setForm(null);
              toast.success("Referência salva no Supabase.");
            }
          }}
        />
      )}
      {deleted && (
        <ConfirmDelete
          name={deleted.name}
          onClose={() => setDeleted(null)}
          onConfirm={async () => {
            if (await remove(deleted.id)) {
              setDeleted(null);
              toast.success("Referência excluída.");
            }
          }}
        />
      )}
      {detail && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setDetail(null);
          }}
        >
          <DialogContent>
            <ReferenceDetail reference={detail} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
