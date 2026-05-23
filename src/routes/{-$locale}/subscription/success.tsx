import { createFileRoute, redirect } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { useIntlayer } from "react-intlayer";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useMySubscription } from "@/features/Subscriptions/api/hooks";
import { Button } from "@/components/ui/button";

type PageState = "activating" | "ready" | "timeout";

const searchSchema = z.object({
  session_id: z.string().optional(),
});

export const Route = createFileRoute("/{-$locale}/subscription/success")({
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    if (!search.session_id) {
      throw redirect({ to: "/{-$locale}/pricing" as any, params: {} as any });
    }
  },
  head: ({ params }) => {
    const { locale } = params;
    const meta = getIntlayer("subscription-success", locale).meta;
    return {
      meta: [{ title: meta.title as string }],
    };
  },
  component: SubscriptionSuccessPage,
});

function SubscriptionSuccessPage() {
  const content = useIntlayer("subscription-success");
  const queryClient = useQueryClient();
  const [pageState, setPageState] = useState<PageState>("activating");
  const attemptsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: sub, refetch } = useMySubscription(false);

  useEffect(() => {
    const poll = async () => {
      attemptsRef.current += 1;

      const result = await refetch();
      const status = result.data?.status;

      if (status === "active" || status === "trialing") {
        setPageState("ready");
        await queryClient.invalidateQueries({ queryKey: ["users", "me"] });
        return;
      }

      if (attemptsRef.current >= 10) {
        setPageState("timeout");
        return;
      }

      timerRef.current = setTimeout(poll, 3000);
    };

    timerRef.current = setTimeout(poll, 3000);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [refetch, queryClient]);

  // Sync state if sub was already ready when component mounts (e.g. fast webhook)
  useEffect(() => {
    if (
      sub?.status === "active" ||
      sub?.status === "trialing"
    ) {
      setPageState("ready");
    }
  }, [sub?.status]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="mx-auto max-w-md w-full text-center">
        {pageState === "activating" && (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 className="size-12 animate-spin text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">
              {content.activating.heading}
            </h1>
            <p className="text-muted-foreground">{content.activating.body}</p>
          </>
        )}

        {pageState === "ready" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="size-8 text-emerald-600" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">
              {content.ready.heading}
            </h1>
            <p className="text-muted-foreground mb-8">{content.ready.body}</p>
            <Button asChild>
              <a href="/admin/properties/new">
                {content.ready.cta}
              </a>
            </Button>
          </>
        )}

        {pageState === "timeout" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="flex size-16 items-center justify-center rounded-full bg-yellow-100">
                <AlertCircle className="size-8 text-yellow-600" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">
              {content.timeout.heading}
            </h1>
            <p className="text-muted-foreground">{content.timeout.body}</p>
          </>
        )}
      </div>
    </div>
  );
}
