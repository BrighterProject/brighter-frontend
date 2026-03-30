import { loginSchema, type LoginValues } from "@Auth/schemas/login.schema";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { cn } from "@/lib/utils";
import { FieldErrors } from "@/components/ui/field-errors";
import { useIntlayer } from "react-intlayer";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { GoogleLogin } from "@react-oauth/google";
import { useRef } from "react";
import { useLogin, useGoogleLogin } from "../api/hooks";

export function LoginForm({ className }: { className?: string }) {
  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLogin();
  const navigate = useLocalizedNavigate();
  const rawNavigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };
  const {
    title,
    description,
    email,
    password,
    loginButton,
    termsText,
    termsLink,
    orSeparator,
    signupButton,
    googleButton,
  } = useIntlayer("login");

  const googleButtonRef = useRef<HTMLDivElement>(null);

  const triggerGoogleLogin = () => {
    googleButtonRef.current
      ?.querySelector<HTMLElement>("div[role=button]")
      ?.click();
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginValues,
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("username", value.email);
      formData.append("password", value.password);

      loginMutation.mutate(formData, {
        onSuccess: () => {
          if (search.redirect) {
            rawNavigate({ to: search.redirect });
          } else {
            navigate({ to: "/" });
          }
        },
        onError: (error) => {
          console.error("Login failed:", error);
        },
      });
    },
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            {description}
          </p>
        </div>

        {/* Email Field */}
        <form.Field
          name="email"
          validators={{ onBlur: loginSchema.shape.email }}
        >
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{email.label}</FieldLabel>
              <Input
                id={field.name}
                // type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
                aria-describedby={
                  field.state.meta.errors.length > 0 ? "email-error" : undefined
                }
              />
              <FieldErrors field={field} />
            </Field>
          )}
        </form.Field>

        {/* Password Field */}
        <form.Field
          name="password"
          validators={{ onBlur: loginSchema.shape.password }}
        >
          {(field) => (
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor={field.name}>{password.label}</FieldLabel>
                <Link className="ml-auto text-sm" to="/auth/login">
                  {password.forgotLink}
                </Link>
              </div>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
                aria-describedby={
                  field.state.meta.errors.length > 0 ? "pass-error" : undefined
                }
              />
              <FieldErrors field={field} />
            </Field>
          )}
        </form.Field>

        <form.Subscribe
          selector={(s) => [s.canSubmit, loginMutation.isPending]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? loginButton.submitting : loginButton.idle}
            </Button>
          )}
        </form.Subscribe>

        <Field>
          <span className="text-center text-xs underline-offset-4 -mt-5 text-muted-foreground">
            {termsText}&nbsp;
            <Link
              to={"/terms-and-conditions" as any}
              className="underline hover:text-primary"
            >
              {termsLink}
            </Link>
          </span>
        </Field>

        <FieldSeparator>{orSeparator}</FieldSeparator>

        <div ref={googleButtonRef} className="hidden">
          <GoogleLogin
            onSuccess={({ credential }) => {
              if (!credential) return;
              googleLoginMutation.mutate(credential, {
                onSuccess: () => {
                  if (search.redirect) {
                    rawNavigate({ to: search.redirect });
                  } else {
                    navigate({ to: "/" });
                  }
                },
              });
            }}
            onError={() => {}}
          />
        </div>

        <Button
          variant="outline"
          type="button"
          disabled={googleLoginMutation.isPending}
          onClick={triggerGoogleLogin}
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="size-4"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
          </svg>
          {googleButton}
        </Button>

        <Button
          variant="outline"
          type="button"
          onClick={() => navigate({ to: "/auth/signup" })}
        >
          {signupButton}
        </Button>
      </FieldGroup>
    </form>
  );
}
