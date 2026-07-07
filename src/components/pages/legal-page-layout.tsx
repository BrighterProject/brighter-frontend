import type { ReactNode } from "react";

interface LegalSection {
  title: ReactNode;
  paragraphs: ReactNode[];
}

interface LegalPageLayoutProps {
  title: ReactNode;
  updated: ReactNode;
  intro: ReactNode;
  sections: LegalSection[];
}

export function LegalPageLayout({
  title,
  updated,
  intro,
  sections,
}: LegalPageLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{updated}</p>
      <p className="mt-6 leading-relaxed text-muted-foreground">{intro}</p>

      <div className="mt-10 space-y-8">
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="font-display text-xl font-semibold text-foreground">
              {section.title}
            </h2>
            <div className="mt-2 space-y-3">
              {section.paragraphs.map((paragraph, j) => (
                <p
                  key={j}
                  className="break-words leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
