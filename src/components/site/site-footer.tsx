import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n/language-provider";

export function SiteFooter() {
  const t = useT();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <span className="font-display text-xl font-bold tracking-widest">
            IRON<span className="text-gold">CODE</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>
        <div>
          <h3 className="text-sm tracking-widest text-gold">{t("footer.train")}</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/programs" className="hover:text-foreground">
              {t("footer.allPrograms")}
            </Link>
            <Link to="/coaching" className="hover:text-foreground">
              {t("nav.coaching")}
            </Link>
            <Link to="/motivation" className="hover:text-foreground">
              {t("nav.motivation")}
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm tracking-widest text-gold">{t("footer.gear")}</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/shop" className="hover:text-foreground">
              {t("nav.shop")}
            </Link>
            <Link to="/cart" className="hover:text-foreground">
              {t("nav.cart")}
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm tracking-widest text-gold">{t("footer.account")}</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/auth" className="hover:text-foreground">
              {t("footer.signIn")}
            </Link>
            <Link to="/profile" className="hover:text-foreground">
              {t("footer.myProfile")}
            </Link>
            <Link to="/chat" className="hover:text-foreground">
              {t("footer.chatCoach")}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("footer.rights")}
      </div>
    </footer>
  );
}
