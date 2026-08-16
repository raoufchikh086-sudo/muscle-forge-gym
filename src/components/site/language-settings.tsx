import { useEffect } from "react";
import { Check, Globe, X } from "lucide-react";
import { languages } from "@/lib/i18n/dictionaries";
import { useLanguage } from "@/lib/i18n/language-provider";

export function LanguageSettings({
  open,
  onOpenChange,
  variant = "icon",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: "icon" | "row";
}) {
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const current = languages.find((l) => l.code === language);

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={() => onOpenChange(true)}
          aria-label={t("settings.language")}
          className="inline-flex h-10 items-center gap-1 rounded-sm px-2 text-muted-foreground transition-colors hover:text-gold"
        >
          <Globe className="h-5 w-5" />
          <span className="font-display text-[11px] uppercase tracking-widest">
            {current?.code.toUpperCase()}
          </span>
        </button>
      ) : (
        <button
          onClick={() => onOpenChange(true)}
          className="flex items-center gap-2 py-3 text-start font-display text-sm uppercase tracking-widest text-foreground"
        >
          <Globe className="h-4 w-4" /> {t("settings.language")} · {current?.native}
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur"
          onClick={() => onOpenChange(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("settings.title")}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-sm border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg uppercase tracking-widest text-foreground">
                  {t("settings.title")}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">{t("settings.languageHint")}</p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                aria-label={t("settings.close")}
                className="text-muted-foreground hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-6 font-display text-[11px] uppercase tracking-[0.3em] text-gold">
              {t("settings.language")}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    onOpenChange(false);
                  }}
                  className={`flex items-center justify-between rounded-sm border px-4 py-3 text-start transition-colors ${
                    l.code === language
                      ? "border-gold text-gold"
                      : "border-border text-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  <span>
                    <span className="font-display text-sm uppercase tracking-widest">
                      {l.native}
                    </span>
                    <span className="ms-2 text-xs text-muted-foreground">{l.label}</span>
                  </span>
                  {l.code === language && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
