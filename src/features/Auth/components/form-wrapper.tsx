import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import { LocalizedLink } from "@/components/ui/localized-link";
import { Card, CardContent } from "@/components/ui/card";

export default function FormWrapper({
  form,
  tagline,
  subtitle,
}: {
  form: ReactNode;
  tagline?: string;
  subtitle?: string;
}) {
  return (
    <div className="relative flex min-h-svh items-center justify-center px-4 py-12 sm:px-6">
      {/* Subtle background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 left-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-4xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: form */}
        <div className="order-2 lg:order-1">
          <Card className="shadow-sm">
            <CardContent className="pt-6">{form}</CardContent>
          </Card>
        </div>

        {/* Right: brand + tagline */}
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <LocalizedLink
            to="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-80 max-lg:justify-center"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <MapPin className="size-5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">
              Brighter.BG
            </span>
          </LocalizedLink>

          {tagline && (
            <div className="space-y-3 max-lg:text-center">
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
                {tagline}
              </h2>
              {subtitle && (
                <p className="max-w-sm text-muted-foreground max-lg:mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Decorative dots */}
          <div className="flex items-center gap-1.5 max-lg:justify-center">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="size-1.5 rounded-full bg-primary/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
