import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { useIntlayer } from "react-intlayer";
import { useMe } from "@/features/Auth/api/hooks";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { Button } from "@/components/ui/button";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";

export const Route = createFileRoute("/{-$locale}/become-owner")({
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("become-owner", locale).meta;
    return {
      meta: [
        { title: meta.title as string },
        { content: meta.description as string, name: "description" },
      ],
    };
  },
  component: BecomeOwnerPage,
});

function BecomeOwnerPage() {
  const content = useIntlayer("become-owner");
  const { data: user } = useMe();
  const localizedNavigate = useLocalizedNavigate();
  const isOwner = user?.scopes?.includes("properties:me") ?? false;

  const handleGetStarted = () => {
    localStorage.setItem("postVerifyRedirect", "/pricing");
    localizedNavigate("/auth/signup");
  };

  const handleSignInUpgrade = () => {
    localizedNavigate("/pricing");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {content.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {!user || !isOwner ? (
              <>
                <Button size="lg" onClick={handleGetStarted}>
                  {content.hero.ctaRegister}
                </Button>
                {user && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleSignInUpgrade}
                  >
                    {content.hero.ctaUpgrade}
                  </Button>
                )}
              </>
            ) : (
              <Button size="lg" asChild>
                <Link to="/pricing">{content.hero.ctaUpgrade}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {content.benefits.title}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {content.benefits.items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {content.howItWorks.title}
        </h2>
        <div className="mt-12 space-y-8">
          {content.howItWorks.steps.map((step, idx) => (
            <div key={idx} className="flex gap-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                <span className="font-display font-bold text-primary">
                  {idx + 1}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {content.testimonials.title}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {content.testimonials.items.map((item, idx) => (
            <blockquote
              key={idx}
              className="rounded-lg border border-border bg-card p-6 italic text-muted-foreground shadow-sm"
            >
              <p>{item.quote}</p>
              <footer className="mt-4 text-sm font-semibold text-foreground">
                — {item.author}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {content.hero.title}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {content.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {!user || !isOwner ? (
              <>
                <Button size="lg" onClick={handleGetStarted}>
                  {content.hero.ctaRegister}
                </Button>
                {user && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleSignInUpgrade}
                  >
                    {content.hero.ctaUpgrade}
                  </Button>
                )}
              </>
            ) : (
              <Button size="lg" asChild>
                <Link to="/pricing">{content.hero.ctaUpgrade}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
