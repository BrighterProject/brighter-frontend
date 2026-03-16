import { useState } from "react";
import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { LocalizedLink } from "@/components/ui/localized-link";
import { CircleHelp, Menu, X } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { UserNav } from "../ui/user-nav";
import { Button } from "../ui/button";
import { useMe } from "@Auth/api/hooks";

const Header: FC = () => {
  const [open, setOpen] = useState(false);
  const content = useIntlayer("header");
  const { data: user } = useMe();

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2/3 items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <LocalizedLink to="/" className="transition-opacity hover:opacity-80">
            <span className="font-display text-2xl tracking-tight text-foreground">
              {content.brand}
            </span>
          </LocalizedLink>

          {/* Desktop right side */}
          <div className="hidden items-center gap-6 md:flex">
            {/* Actions: help + locale */}
            <div className="flex items-center gap-4">
              <button
                aria-label={content.aria.help.value as string}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <CircleHelp className="size-6" />
              </button>
              <LocaleSwitcher />
            </div>

            {/* Account buttons or UserNav */}
            {user ? (
              <UserNav />
            ) : (
              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="default"
                  className="shadow-sm"
                  asChild
                >
                  <LocalizedLink to="/auth/login">
                    {content.signIn}
                  </LocalizedLink>
                </Button>
                <Button size="default" asChild>
                  <LocalizedLink to="/auth/signup">
                    {content.createAccount}
                  </LocalizedLink>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={content.aria.toggle.value as string}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
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
              <div className="space-y-2 px-4 pb-4 pt-3 sm:px-6">
                {user ? (
                  <UserNav onAction={() => setOpen(false)} />
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full shadow-sm"
                      asChild
                    >
                      <LocalizedLink
                        to="/auth/login"
                        onClick={() => setOpen(false)}
                      >
                        {content.signIn}
                      </LocalizedLink>
                    </Button>
                    <Button size="sm" className="w-full" asChild>
                      <LocalizedLink
                        to="/auth/signup"
                        onClick={() => setOpen(false)}
                      >
                        {content.createAccount}
                      </LocalizedLink>
                    </Button>
                  </>
                )}

                <div className="flex items-center justify-between border-t pt-3">
                  <LocaleSwitcher />
                  <button
                    aria-label={content.aria.help.value as string}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <CircleHelp className="size-5" />
                  </button>
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
