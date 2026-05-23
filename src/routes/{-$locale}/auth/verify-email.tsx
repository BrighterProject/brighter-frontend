import FormWrapper from "@/features/Auth/components/form-wrapper";
import { useVerifyEmail } from "@/features/Auth/api/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { useIntlayer } from "react-intlayer";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { useEffect } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/{-$locale}/auth/verify-email")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  head: ({ params }) => {
    const { locale } = params;
    const metaContent = getIntlayer("verify-email", locale).meta;

    return {
      meta: [
        { title: metaContent.title },
        { content: metaContent.description, name: "description" },
      ],
    };
  },
});

function RouteComponent() {
  const { locale } = Route.useParams();
  const content = getIntlayer("verify-email", locale);

  return (
    <FormWrapper
      form={<VerifyEmailCard />}
      tagline={content.panel.tagline as string}
      subtitle={content.panel.subtitle as string}
    />
  );
}

const SAFE_REDIRECTS = ["/pricing"];

function VerifyEmailCard() {
  const { token } = Route.useSearch();
  const { locale } = Route.useParams();
  const content = useIntlayer("verify-email");
  const verifyMutation = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token);
    }
  }, [token]);

  if (verifyMutation.isPending || !token) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">{content.verifying}</p>
      </div>
    );
  }

  if (verifyMutation.isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="size-8 text-destructive" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {content.error.title}
        </h1>
        <p className="text-muted-foreground text-sm text-balance max-w-sm">
          {content.error.description}
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/auth/signup">{content.error.retry}</Link>
        </Button>
      </div>
    );
  }

  if (verifyMutation.isSuccess) {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("postVerifyRedirect")
        : null;
    const redirectTo =
      stored && SAFE_REDIRECTS.includes(stored) ? stored : null;

    if (redirectTo) {
      localStorage.removeItem("postVerifyRedirect");
      window.location.href = `/${locale}${redirectTo}`;
      return null;
    }

    if (stored) {
      localStorage.removeItem("postVerifyRedirect");
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="size-8 text-emerald-500" />
      </div>
      <h1 className="font-display text-2xl font-bold tracking-tight">
        {content.success.title}
      </h1>
      <p className="text-muted-foreground text-sm text-balance max-w-sm">
        {content.success.description}
      </p>
      <Button asChild className="mt-2">
        <Link to="/auth/login">{content.success.button}</Link>
      </Button>
    </div>
  );
}
