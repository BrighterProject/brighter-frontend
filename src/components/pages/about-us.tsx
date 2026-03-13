import { useIntlayer } from "react-intlayer";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MapPin, Code2, Target, Users, ArrowRight } from "lucide-react";
import { LocalizedLink as Link } from "@/components/ui/localized-link";

const VALUE_ICONS = [
  <Code2 className="size-6" />,
  <Target className="size-6" />,
  <Users className="size-6" />,
];

export function AboutUs() {
  const content = useIntlayer("about-us");

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pb-12 pt-10 lg:pb-16 lg:pt-14">
        <div className="pointer-events-none absolute -right-32 top-0 size-[500px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge
            variant="outline"
            className="mb-4 border-primary/30 bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
          >
            <MapPin className="mr-1.5 size-3.5" />
            {content.hero.badge}
          </Badge>

          <h1 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            {content.hero.title}
          </h1>

          <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {content.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.story.title}
          </h2>
          <div className="mt-6 space-y-5">
            {content.story.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.values.title}
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {content.values.items.map((item, index) => (
              <div
                key={index}
                className="group rounded-2xl border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {VALUE_ICONS[index]}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* List Your Property */}
      <section id="list-your-property" className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {content.listProperty.title}
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              {content.listProperty.subtitle}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {content.listProperty.steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {index < 2 && (
                  <div className="absolute left-[calc(50%+3rem)] top-8 hidden h-px w-[calc(100%-6rem)] bg-border md:block" />
                )}

                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <span className="font-display text-xl font-bold">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-1.5 font-display text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button size="lg" className="gap-2 px-8 shadow-lg shadow-primary/20" asChild>
              <Link to="/contacts">
                {content.listProperty.cta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
