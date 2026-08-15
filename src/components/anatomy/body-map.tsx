import { muscleRegions, type AnatomySide, type MuscleRegion } from "@/lib/anatomy";

const SILHOUETTE =
  "M120 40 C132 40 141 50 141 63 C141 74 137 82 132 87 C146 92 160 98 168 108 C177 119 181 136 183 156 C185 178 187 196 189 210 C191 224 186 230 179 230 C173 230 169 224 167 212 L162 184 L160 232 C159 248 156 262 152 276 C156 300 158 322 157 344 C156 372 153 400 150 428 C148 448 147 462 146 472 C145 482 138 486 131 484 C125 482 122 477 122 469 C122 448 121 420 120 400 C119 420 118 448 118 469 C118 477 115 482 109 484 C102 486 95 482 94 472 C93 462 92 448 90 428 C87 400 84 372 83 344 C82 322 84 300 88 276 C84 262 81 248 80 232 L78 184 L73 212 C71 224 67 230 61 230 C54 230 49 224 51 210 C53 196 55 178 57 156 C59 136 63 119 72 108 C80 98 94 92 108 87 C103 82 99 74 99 63 C99 50 108 40 120 40 Z";

export function BodyMap({
  side,
  selected,
  onSelect,
}: {
  side: AnatomySide;
  selected: MuscleRegion | null;
  onSelect: (m: MuscleRegion) => void;
}) {
  const regions = muscleRegions.filter((m) => m.side === side);

  return (
    <svg
      viewBox="0 0 240 520"
      className="h-full w-full"
      role="img"
      aria-label={`${side} view of the human muscular system`}
    >
      <defs>
        <linearGradient id="bodyfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-card)" />
          <stop offset="100%" stopColor="var(--color-secondary)" />
        </linearGradient>
      </defs>

      <path
        d={SILHOUETTE}
        fill="url(#bodyfill)"
        stroke="var(--color-border)"
        strokeWidth="1.5"
      />

      {regions.map((m) => {
        const active = selected?.id === m.id;
        return (
          <g
            key={m.id}
            role="button"
            tabIndex={0}
            aria-label={m.name}
            onClick={() => onSelect(m)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelect(m);
            }}
            className="cursor-pointer outline-none"
          >
            {m.shapes.map((s, i) => (
              <path
                key={i}
                d={s.d}
                fill="var(--color-gold)"
                stroke="var(--color-gold)"
                strokeWidth="0.8"
                className="transition-opacity duration-200"
                opacity={active ? 0.95 : 0.32}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
