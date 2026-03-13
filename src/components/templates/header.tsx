import { useState } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { LocalizedLink } from "@/components/ui/localized-link";
import { MapPin, Menu, X, Search } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { UserNav } from "../ui/user-nav";
import { Button } from "../ui/button";

const Header: FC = () => {
  const [open, setOpen] = useState(false);

  const content = useIntlayer("header");

  return (
    <header className="sticky top-0 z-40">
      {/* Accent top line */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <LocalizedLink
            to="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <MapPin className="size-4.5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              {content.brand}
            </span>
          </LocalizedLink>

          {/* Desktop nav */}
          <nav
            aria-label={content.aria.nav as string}
            className="hidden items-center gap-1 md:flex"
          >
            {content.navLinks.map((link) => (
              <LocalizedLink
                key={link.href.value}
                to={link.href.value}
                className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-primary [&.active]:font-semibold"
                activeProps={{ className: "active" }}
              >
                {link.label}
              </LocalizedLink>
            ))}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-2.5">
            {/* Desktop actions */}
            <div className="hidden items-center gap-2.5 md:flex">
              <Button asChild size="sm" className="gap-1.5 shadow-sm">
                <LocalizedLink to="/properties">
                  <Search className="size-3.5" />
                  {content.cta}
                </LocalizedLink>
              </Button>
              <LocaleSwitcher />
              <UserNav />
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={content.aria.toggle as string}
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden border-t md:hidden"
            >
              <div className="space-y-1 px-4 pb-4 pt-3 sm:px-6">
                {content.navLinks.map((link) => (
                  <LocalizedLink
                    key={link.href.value}
                    to={link.href.value}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted [&.active]:bg-primary/10 [&.active]:text-primary"
                    activeProps={{ className: "active" }}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </LocalizedLink>
                ))}

                <div className="pt-2">
                  <Button
                    asChild
                    size="sm"
                    className="w-full gap-1.5 shadow-sm"
                  >
                    <LocalizedLink
                      to="/properties"
                      onClick={() => setOpen(false)}
                    >
                      <Search className="size-3.5" />
                      {content.cta}
                    </LocalizedLink>
                  </Button>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <LocaleSwitcher />
                  <UserNav onAction={() => setOpen(false)} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
