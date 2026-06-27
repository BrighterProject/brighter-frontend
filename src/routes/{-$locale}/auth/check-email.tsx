import FormWrapper from "@/features/Auth/components/form-wrapper";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { useIntlayer } from "react-intlayer";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { MailCheck } from "lucide-react";

export const Route = createFileRoute("/{-$locale}/auth/check-email")({
  component: RouteComponent,
  head: ({ params }) => {
    const { locale } = params;
    const metaContent = getIntlayer("check-email", locale).meta;

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
  const content = getIntlayer("check-email", locale);

  return (
    <FormWrapper
      form={<CheckEmailCard />}
      tagline={content.panel.tagline as string}
      subtitle={content.panel.subtitle as string}
    />
  );
}

function CheckEmailCard() {
  const content = useIntlayer("check-email");
  const { locale } = useParams({ strict: false }) as { locale: string };

  const storedRedirect =
    typeof window !== "undefined"
      ? localStorage.getItem("postVerifyRedirect")
      : null;
  const hasPricingRedirect = storedRedirect === "/pricing";
  const loginSearch = hasPricingRedirect
    ? { redirect: `/${locale}/pricing` }
    : undefined;

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
        <MailCheck className="size-8 text-primary" />
      </div>
      <h1 className="font-display text-2xl font-bold tracking-tight">
        {content.title}
      </h1>
      <p className="text-muted-foreground text-sm text-balance max-w-sm">
        {content.description}
      </p>
      <p className="text-muted-foreground/60 text-xs">
        {content.spamHint}
      </p>
      {hasPricingRedirect && (
        <p className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
          {content.pricingRedirectHint}
        </p>
      )}
      <p className="text-sm text-muted-foreground mt-2">
        {content.loginPrompt.text}
        <Link
          to="/auth/login"
          search={loginSearch}
          className="font-medium text-primary underline underline-offset-4"
        >
          {content.loginPrompt.link}
        </Link>
      </p>
    </div>
  );
}
