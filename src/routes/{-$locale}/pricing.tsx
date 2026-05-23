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
import type { SubscriptionPlan } from "@/features/Subscriptions/api/types";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { Button } from "@/components/ui/button";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { X } from "lucide-react";

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
    if (plan.stripe_price_id === null) {
      await localizedNavigate("/contacts");
      return;
    }

    if (!user) {
      localStorage.setItem("postVerifyRedirect", "/pricing");
      await localizedNavigate("/auth/signup");
      return;
    }

    const result = await checkout.mutateAsync({
      planSlug: plan.slug,
      locale,
    });
    window.location.href = result.checkout_url;
  };

  const getCtaLabel = (plan: SubscriptionPlan): string => {
    if (plan.stripe_price_id === null) {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Cancelled banner */}
        {status === "cancelled" && !dismissed && (
          <div className="mb-8 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
        )}

        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {content.hero.subtitle}
          </p>
        </div>

        {/* Plan cards */}
        {plansLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border bg-card p-6"
              >
                <div className="mb-4 h-6 w-1/2 rounded bg-muted" />
                <div className="mb-2 h-10 w-2/3 rounded bg-muted" />
                <div className="mb-6 h-4 w-full rounded bg-muted" />
                <div className="h-10 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans?.map((plan) => {
              const isCurrentPlan =
                subscription?.plan.slug === plan.slug &&
                (subscription.status === "active" ||
                  subscription.status === "trialing");
              const priceEur = (plan.price_eur_cents / 100).toFixed(0);

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md ${
                    isCurrentPlan
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border"
                  }`}
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      {plan.name}
                    </h2>
                    <div className="mt-2 flex items-end gap-1">
                      <span className="font-display text-4xl font-bold text-foreground">
                        €{priceEur}
                      </span>
                      <span className="mb-1 text-sm text-muted-foreground">
                        /mo
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.max_listings} {content.plan.listings}
                    </p>
                  </div>

                  <div className="mt-auto pt-4">
                    <Button
                      className="w-full"
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
            <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {content.enterprise.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {content.enterprise.description}
                </p>
              </div>
              <div className="mt-auto pt-4">
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/contacts">
                    {content.plan.cta.contactUs}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
