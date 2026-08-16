import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShoppingBag, User as UserIcon, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n/language-provider";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { LanguageSettings } from "@/components/site/language-settings";

const links = [
  { to: "/programs", key: "nav.programs" },
  { to: "/generator", key: "nav.generator" },
  { to: "/technique", key: "nav.technique" },
  { to: "/skills", key: "nav.skills" },
  { to: "/anatomy", key: "nav.anatomy" },
  { to: "/nutrition", key: "nav.nutrition" },
  { to: "/home-gym", key: "nav.homeGym" },
  { to: "/plans", key: "nav.plans" },
  { to: "/coaching", key: "nav.coaching" },
  { to: "/shop", key: "nav.shop" },
  { to: "/motivation", key: "nav.motivation" },
] as const satisfies ReadonlyArray<{ to: string; key: TranslationKey }>;

export function SiteHeader() {
  const { isAuthenticated } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const t = useT();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold tracking-widest text-foreground">
            IRON<span className="text-gold">CODE</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="font-display text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
              activeProps={{ className: "text-gold" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSettings open={settingsOpen} onOpenChange={setSettingsOpen} />

          <Link
            to="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-gold"
            aria-label={t("nav.cart")}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/profile"
                className="inline-flex h-10 items-center gap-2 rounded-sm border border-border px-3 font-display text-xs uppercase tracking-widest text-foreground hover:border-gold hover:text-gold"
              >
                <UserIcon className="h-4 w-4" /> {t("nav.profile")}
              </Link>
              <button
                onClick={signOut}
                className="h-10 px-3 font-display text-xs uppercase tracking-widest text-muted-foreground hover:text-gold"
              >
                {t("nav.signOut")}
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden h-10 items-center rounded-sm bg-gold px-4 font-display text-xs font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
            >
              {t("nav.join")}
            </Link>
          )}

          <button
            className="inline-flex h-10 w-10 items-center justify-center text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("nav.menu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card lg:hidden">
          <div className="flex flex-col px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 font-display text-sm uppercase tracking-widest text-foreground"
              >
                {t(l.key)}
              </Link>
            ))}
            <LanguageSettings
              variant="row"
              open={settingsOpen}
              onOpenChange={(v) => {
                setSettingsOpen(v);
                if (v) setOpen(false);
              }}
            />
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="py-3 font-display text-sm uppercase tracking-widest text-foreground"
                >
                  {t("nav.profile")}
                </Link>
                <Link
                  to="/chat"
                  onClick={() => setOpen(false)}
                  className="py-3 font-display text-sm uppercase tracking-widest text-foreground"
                >
                  {t("nav.chat")}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                  className="py-3 text-start font-display text-sm uppercase tracking-widest text-muted-foreground"
                >
                  {t("nav.signOut")}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex h-11 items-center justify-center rounded-sm bg-gold font-display text-sm font-bold uppercase tracking-widest text-primary-foreground"
              >
                {t("nav.join")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
