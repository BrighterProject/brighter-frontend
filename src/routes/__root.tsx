import {
  HeadContent,
  Scripts,
  createRootRoute,
  redirect,
  useMatches,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { defaultLocale, getHTMLTextDir, getIntlayer } from "intlayer";
import { IntlayerProvider } from "react-intlayer";
import { queryClient } from "@/constants";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import Header from "@/components/templates/header";
import Footer from "@/components/templates/footer";
import { CookieConsentBanner } from "@/components/templates/cookie-consent-banner";
import { Analytics } from "@/components/templates/analytics";
import { ErrorBoundary } from "@/components/error-boundary";
import { rootMetaExtras } from "@/lib/site-meta";
import { trailingSlashRedirect } from "@/lib/trailing-slash";

export const Route = createRootRoute({
  // Enforce the no-trailing-slash canonical form with a 301 at the SSR layer
  // (1.5), before any per-page canonical tag is resolved.
  beforeLoad: ({ location }) => {
    const target = trailingSlashRedirect(
      location.pathname,
      location.searchStr,
      location.hash,
    );
    if (target) {
      throw redirect({ href: target, statusCode: 301 });
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        // Fallback title only — every localized page overrides this via the
        // {-$locale} layout head and per-route heads (buildSeo).
        title: getIntlayer("root", defaultLocale).meta.title,
      },
      ...rootMetaExtras(),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const matches = useMatches();

  // Try to find locale in params of any active match
  // This assumes you use the dynamic segment "/{-$locale}" in your route tree
  const localeRoute = matches.find((match) => match.routeId === "/{-$locale}");
  const locale = localeRoute?.params?.locale ?? defaultLocale;

  return (
    <html suppressHydrationWarning dir={getHTMLTextDir(locale)} lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""}
        >
          <IntlayerProvider locale={locale}>
            <QueryClientProvider client={queryClient}>
              <ErrorBoundary>
                <Header />
                {children}
                <Footer />
              </ErrorBoundary>
              <Toaster richColors position="top-right" />
              <CookieConsentBanner />
              <Analytics />
              <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="bottom-left"
              />
            </QueryClientProvider>
          </IntlayerProvider>
        </GoogleOAuthProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
