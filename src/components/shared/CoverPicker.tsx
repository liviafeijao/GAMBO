import { useAssetUrl } from "@/hooks/useAssetUrl";
import { coverGroups } from "@/data/repositories";

export function CoverPicker({
  cover,
  onChange,
}: {
  cover: string;
  onChange: (cover: string) => void;
}) {
  const previewUrl = useAssetUrl(cover);
  const selectedOption = coverGroups
    .flatMap((group) => group.options)
    .find((option) => option.cover === cover);

  return (
    <div className="cover-picker wide">
      <div className="cover-picker-selection">
        {previewUrl && <img src={previewUrl} alt="" />}
        <div>
          <strong>Capa demonstrativa</strong>
          <span>{selectedOption?.name ?? "Imagem enviada"}</span>
        </div>
      </div>
      <div className="cover-picker-groups" aria-label="Opções de capa">
        {coverGroups.map((group) => (
          <details
            className="cover-picker-group"
            key={group.name}
            open={group.options.some((option) => option.cover === cover)}
          >
            <summary>
              {group.name}
              <span>{group.options.length} capas</span>
            </summary>
            <div className="cover-picker-grid">
              {group.options.map((option) => (
                <button
                  type="button"
                  className={`cover-picker-option${cover === option.cover ? " selected" : ""}`}
                  key={option.name}
                  aria-pressed={cover === option.cover}
                  onClick={() => onChange(option.cover)}
                >
                  <img src={option.cover} alt="" loading="lazy" />
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
