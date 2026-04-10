import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { FieldErrors } from "@/components/ui/field-errors";
import { useForm } from "@tanstack/react-form";
import { signupSchema, type SignupValues } from "../schemas/signup.schema";
import { useIntlayer } from "react-intlayer";
import { GoogleLogin } from "@react-oauth/google";
import { useRef } from "react";
import { useRegisterUser, useGoogleLogin } from "../api/hooks";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { useParams } from "@tanstack/react-router";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { locale } = useParams({ strict: false }) as { locale?: string };
  const registerMutation = useRegisterUser(locale || "bg");
  const googleLoginMutation = useGoogleLogin();
  const navigate = useLocalizedNavigate();
  const content = useIntlayer("signup");

  const googleButtonRef = useRef<HTMLDivElement>(null);

  const triggerGoogleLogin = () => {
    googleButtonRef.current
      ?.querySelector<HTMLElement>("div[role=button]")
      ?.click();
  };

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as SignupValues,
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      registerMutation.mutate(
        {
          username: value.email,
          password: value.password,
          full_name: value.name,
          email: value.email,
        },
        {
          onSuccess: () => {
            navigate("/auth/check-email");
          },
        },
      );
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
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {content.title}
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            {content.description}
          </p>
        </div>

        {/* --- Full Name Field --- */}
        <form.Field
          name="name"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {content.fields.name.label}
              </FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={content.fields.name.placeholder.value}
              />
              <FieldErrors field={field} />
            </Field>
          )}
        />

        {/* --- Email Field --- */}
        <form.Field
          name="email"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {content.fields.email.label}
              </FieldLabel>
              <Input
                id={field.name}
                // type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={content.fields.email.placeholder.value}
              />
              <FieldErrors field={field} />
            </Field>
          )}
        />

        {/* --- Password Field --- */}
        <form.Field
          name="password"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {content.fields.password.label}
              </FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                {content.fields.password.hint}
              </FieldDescription>
              <FieldErrors field={field} />
            </Field>
          )}
        />

        {/* --- Confirm Password --- */}
        <form.Field
          name="confirmPassword"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {content.fields.confirmPassword.label}
              </FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldErrors field={field} />
            </Field>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, registerMutation.isPending]}
          children={([canSubmit, isSubmitting]) => (
            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? content.button.submitting : content.button.idle}
              </Button>
            </Field>
          )}
        />

        <Field>
          <span className="text-center text-xs underline-offset-4 -mt-5 text-muted-foreground">
            {content.legal.text}
            <Link
              to={"/terms-and-conditions" as any}
              className="underline hover:text-primary"
            >
              {content.legal.link}
            </Link>
          </span>
        </Field>

        <FieldSeparator>{content.separator}</FieldSeparator>

        <div ref={googleButtonRef} className="hidden">
          <GoogleLogin
            onSuccess={({ credential }) => {
              if (!credential) return;
              googleLoginMutation.mutate(credential, {
                onSuccess: () => navigate("/"),
              });
            }}
            onError={() => {}}
          />
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full"
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
          {content.googleButton}
        </Button>

        <Field>
          <FieldDescription className="px-6 text-center">
            {content.loginPrompt.text}
            <Link
              to="/auth/login"
              className="font-medium text-primary underline underline-offset-4 cursor-pointer"
            >
              {content.loginPrompt.link}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
