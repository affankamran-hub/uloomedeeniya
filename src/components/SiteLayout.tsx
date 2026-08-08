import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import logo from "@/assets/logo.jpeg.asset.json";
import { SITE } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UpdatesDrawer } from "@/components/UpdatesDrawer";
import { AiHelper } from "@/components/AiHelper";
import { SideNav, SideNavLinks, PRIMARY_NAV, SIDE_NAV } from "@/components/SideNav";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {PRIMARY_NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground data-[status=active]:bg-primary-foreground/15 data-[status=active]:text-gold"
        >
          {item.en} <span className="urdu ms-1 text-xs">{item.ur}</span>
        </Link>
      ))}
    </>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="hero-surface sticky top-0 z-40 border-b border-primary-foreground/10">
        <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo.url}
              alt="Tauheed Trust official logo"
              className="size-11 rounded-full ring-2 ring-gold/70"
            />
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-lg text-primary-foreground">
                {SITE.org.en}
              </span>
              <span className="urdu block text-xs text-gold">{SITE.organizer.ur}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <NavLinks />
          </nav>

          <div className="ms-auto flex items-center gap-2">
            <UpdatesDrawer />
            <ThemeToggle />
            {user ? (
              <>
                <Button asChild variant="onDark" size="sm" className="hidden sm:inline-flex">
                  <Link to="/profile">Profile</Link>
                </Button>
                {isAdmin && (
                  <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <Button size="sm" variant="onDark" onClick={() => signOut()} className="hidden sm:inline-flex">
                  Sign out
                </Button>
              </>
            ) : (
              <Button asChild size="sm" variant="gold">
                <Link to="/auth">Login / Register</Link>
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button size="icon" variant="onDark" aria-label="Open menu">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 overflow-y-auto bg-card">
                <nav className="mt-10 flex flex-col gap-1">
                  <SideNavLinks items={PRIMARY_NAV.concat(SIDE_NAV)} />
                  {user && (
                    <Button variant="outline" className="mt-4" onClick={() => signOut()}>
                      Sign out
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <SideNav user={!!user} isAdmin={isAdmin} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <AiHelper />

      <footer className="hero-surface mt-16 text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          <div>
            <h3 className="text-lg text-gold">{SITE.institute.en}</h3>
            <p className="urdu text-sm">{SITE.institute.ur}</p>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Organized by {SITE.organizer.en} under {SITE.org.en}.
            </p>
          </div>
          <div>
            <h3 className="text-lg text-gold">Address / پتہ</h3>
            <p className="mt-2 text-sm text-primary-foreground/80">{SITE.address.en}</p>
            <p className="urdu mt-1 text-sm text-primary-foreground/80">{SITE.address.ur}</p>
          </div>
          <div>
            <h3 className="text-lg text-gold">Websites</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {SITE.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-foreground/85 underline-offset-4 hover:text-gold hover:underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="urdu mt-4 text-sm text-gold">تعلیمِ دین بالکل مفت ہے</p>
            <p className="text-sm text-primary-foreground/80">No fees — knowledge in Allah's way.</p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/15">
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-6 text-xs text-primary-foreground/70">
            <p>
              Registered and organised under {SITE.org.en} ({SITE.org.ur}) — a recognised welfare and
              educational trust. Classes of {SITE.institute.en} are conducted by {SITE.organizer.en}.
            </p>
            <p className="urdu">
              {SITE.org.ur} کے تحت رجسٹرڈ و تسلیم شدہ — تمام حقوق محفوظ ہیں۔
            </p>
            <p>
              © {new Date().getFullYear()} {SITE.org.en}. All rights reserved. Content of this website may
              not be reproduced for commercial use.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
