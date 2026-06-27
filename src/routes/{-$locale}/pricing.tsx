import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { useIntlayer } from "react-intlayer";
import { useState } from "react";
import { useMe } from "@/features/Auth/api/hooks";
import {
  usePlans,
  useMySubscription,
  useCheckout,
} from "@/features/Subscriptions/api/hooks";
import type { SubscriptionPlan, SubscriptionPlanSlug } from "@/features/Subscriptions/api/types";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import {
  Home,
  Building2,
  LayoutGrid,
  Briefcase,
  CreditCard,
  RefreshCw,
  Headphones,
  X,
} from "lucide-react";

export const Route = createFileRoute("/{-$locale}/pricing")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: typeof search.status === "string" ? search.status : undefined,
  }),
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("pricing-page", locale).meta;
    return {
      meta: [
        { title: meta.title as string },
        { content: meta.description as string, name: "description" },
      ],
    };
  },
  component: PricingPage,
});

const PLAN_ICON: Record<SubscriptionPlanSlug, React.ReactNode> = {
  starter: <Home className="size-5" />,
  basic: <Building2 className="size-5" />,
  pro: <LayoutGrid className="size-5" />,
  business: <Briefcase className="size-5" />,
  enterprise: null,
};

const MOST_POPULAR_SLUG: SubscriptionPlanSlug = "basic";

function perPropertyEur(plan: SubscriptionPlan): string | null {
  if (plan.max_listings <= 1) return null;
  const eur = plan.price_eur_cents / 100 / plan.max_listings;
  return `€${eur % 1 === 0 ? eur.toFixed(0) : eur.toFixed(2)}`;
}

function PricingPage() {
  const { status } = Route.useSearch();
  const content = useIntlayer("pricing-page");
  const { data: user } = useMe();
  const { data: plans, isPending: plansLoading } = usePlans();
  const isOwner = user?.scopes?.includes("properties:me") ?? false;
  const { data: subscription } = useMySubscription(isOwner);
  const checkout = useCheckout();
  const localizedNavigate = useLocalizedNavigate();
  const [dismissed, setDismissed] = useState(false);

  const { locale: localeParam } = Route.useParams();
  const locale = localeParam ?? "bg";

  const handleCta = async (plan: SubscriptionPlan) => {
    if (plan.slug === "enterprise") {
      await localizedNavigate("/contacts");
      return;
    }
    if (!user) {
      localStorage.setItem("postVerifyRedirect", "/pricing");
      await localizedNavigate("/auth/signup");
      return;
    }
    const result = await checkout.mutateAsync({ planSlug: plan.slug, locale });
    window.location.href = result.checkout_url;
  };

  const getCtaLabel = (plan: SubscriptionPlan): string => {
    if (plan.slug === "enterprise") {
      return content.plan.cta.contactUs.value as string;
    }
    if (!user) {
      return content.plan.cta.getStarted.value as string;
    }
    if (subscription?.plan.slug === plan.slug) {
      if (subscription.status === "active") {
        return content.plan.cta.currentPlan.value as string;
      }
      if (subscription.status === "trialing") {
        return content.plan.cta.trialing.value as string;
      }
    }
    return content.plan.cta.upgrade.value as string;
  };

  const isCtaDisabled = (plan: SubscriptionPlan): boolean => {
    if (!subscription) return false;
    return (
      subscription.plan.slug === plan.slug &&
      (subscription.status === "active" || subscription.status === "trialing")
    );
  };

  const taglines = content.plan.taglines as Record<string, { value: string }>;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pb-14 pt-12 lg:pb-20 lg:pt-16">
        <div className="pointer-events-none absolute -right-32 top-0 size-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Badge
            variant="outline"
            className="mb-4 border-primary/30 bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
          >
            <CreditCard className="mr-1.5 size-3.5" />
            {content.hero.badge}
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {content.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Cancelled banner */}
      {status === "cancelled" && !dismissed && (
        <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>{content.banner.cancelled}</span>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="ml-4 rounded p-1 hover:bg-destructive/20"
              aria-label={content.banner.dismiss.value as string}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {plansLoading ? (
          <div className="flex flex-wrap justify-center gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-full animate-pulse rounded-2xl border bg-card p-6 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="mb-4 size-11 rounded-xl bg-muted" />
                <div className="mb-2 h-5 w-1/2 rounded bg-muted" />
                <div className="mb-4 h-3 w-3/4 rounded bg-muted" />
                <div className="mb-6 h-9 w-2/3 rounded bg-muted" />
                <div className="h-10 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {plans?.filter((p) => p.slug !== "enterprise").map((plan) => {
              const isCurrentPlan =
                subscription?.plan.slug === plan.slug &&
                (subscription.status === "active" ||
                  subscription.status === "trialing");
              const isPopular = plan.slug === MOST_POPULAR_SLUG;
              const priceEur = (plan.price_eur_cents / 100).toFixed(0);
              const perProp = perPropertyEur(plan);
              const icon = PLAN_ICON[plan.slug];
              const tagline = taglines[plan.slug]?.value;

              return (
                <div
                  key={plan.id}
                  className={`group relative flex w-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] ${
                    isCurrentPlan || isPopular
                      ? "border-primary/30 ring-2 ring-primary/20"
                      : "border-border"
                  }`}
                >
                  {isPopular && !isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20">
                        {content.plan.mostPopular}
                      </Badge>
                    </div>
                  )}

                  {icon && (
                    <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      {icon}
                    </div>
                  )}

                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {plan.name}
                  </h2>
                  {tagline && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {tagline}
                    </p>
                  )}

                  <div className="mt-4 flex items-end gap-1.5">
                    <span className="font-display text-4xl font-bold text-foreground">
                      €{priceEur}
                    </span>
                    <span className="mb-1 text-sm text-muted-foreground">
                      {content.plan.perMonth}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {content.plan.upTo}{" "}
                      <span className="font-medium text-foreground">
                        {plan.max_listings}
                      </span>{" "}
                      {content.plan.properties}
                    </span>
                    {perProp && (
                      <span className="rounded-full bg-primary/8 px-2 py-0.5 text-xs font-medium text-primary">
                        {perProp} {content.plan.perProperty}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-6">
                    <Button
                      className={`w-full ${isPopular && !isCurrentPlan ? "shadow-md shadow-primary/20" : ""}`}
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={isCtaDisabled(plan) || checkout.isPending}
                      onClick={() => handleCta(plan)}
                    >
                      {getCtaLabel(plan)}
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Enterprise card */}
            <div className="flex w-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Briefcase className="size-5" />
              </div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                {content.enterprise.name}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {content.enterprise.tagline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {content.enterprise.description}
              </p>
              <div className="mt-auto pt-6">
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/contacts">{content.plan.cta.contactUs}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trust bar */}
      <div className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-center sm:gap-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="size-4 text-primary" />
            {content.trust.payments}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="size-4 text-primary" />
            {content.trust.cancel}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Headphones className="size-4 text-primary" />
            {content.trust.support}
          </div>
        </div>
      </div>
    </div>
  );
}
