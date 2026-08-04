import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <span className="font-display text-xl font-bold tracking-widest">
            IRON<span className="text-gold">CODE</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Train in the gym or at home, with machines or with nothing but your body. Discipline
            over motivation.
          </p>
        </div>
        <div>
          <h3 className="text-sm tracking-widest text-gold">Train</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/programs" className="hover:text-foreground">
              All programs
            </Link>
            <Link to="/coaching" className="hover:text-foreground">
              Coaching
            </Link>
            <Link to="/motivation" className="hover:text-foreground">
              Motivation
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm tracking-widest text-gold">Gear</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/shop" className="hover:text-foreground">
              Shop
            </Link>
            <Link to="/cart" className="hover:text-foreground">
              Cart
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm tracking-widest text-gold">Account</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/auth" className="hover:text-foreground">
              Sign in
            </Link>
            <Link to="/profile" className="hover:text-foreground">
              My profile
            </Link>
            <Link to="/chat" className="hover:text-foreground">
              Chat with a coach
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} IRONCODE. Train hard, stay humble.
      </div>
    </footer>
  );
}
