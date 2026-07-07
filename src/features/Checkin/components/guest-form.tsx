import { useMemo, useState } from "react";
import axios from "axios";
import { useForm } from "@tanstack/react-form";
import { useIntlayer } from "react-intlayer";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { FieldErrors } from "@/components/ui/field-errors";
import { Checkbox } from "@/components/ui/checkbox";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { guestIdentitySchema } from "../schemas/guest-identity";
import type { DocumentType, Gender, GuestIdentityCreate } from "../api/types";
import { COUNTRY_CODES } from "../lib/countries";

interface GuestFormProps {
  locale: string;
  submitting: boolean;
  onSubmit: (payload: GuestIdentityCreate) => Promise<void>;
  onCancel: () => void;
}

interface FormValues {
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender | "";
  citizenship: string;
  document_type: DocumentType | "";
  document_number: string;
  document_issuing_country: string;
  pin_egn: string;
}

const EMPTY: FormValues = {
  first_name: "",
  middle_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "",
  citizenship: "",
  document_type: "",
  document_number: "",
  document_issuing_country: "",
  pin_egn: "",
};

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

// Cross-field rules (middle_name/pin_egn required when citizenship === "BG")
// mean a single field's validity depends on sibling values — re-parse the
// whole object on every field's validator and pick out that field's issue.
function fieldError(values: FormValues, name: keyof FormValues) {
  const parsed = guestIdentitySchema.safeParse({
    ...values,
    middle_name: values.middle_name || undefined,
    pin_egn: values.pin_egn || undefined,
  });
  if (parsed.success) return undefined;
  const issue = parsed.error.issues.find((i) => i.path[0] === name);
  return issue?.message;
}

export function GuestForm({
  locale,
  submitting,
  onSubmit,
  onCancel,
}: GuestFormProps) {
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const c = useIntlayer("guest-form");

  const countryOptions = useMemo(() => {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    return COUNTRY_CODES.map((code) => ({
      code,
      name: dn.of(code) ?? code,
    })).sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  const form = useForm({
    defaultValues: EMPTY,
    onSubmit: async ({ value }) => {
      setFormError(null);
      const isBG = value.citizenship === "BG";
      const payload: GuestIdentityCreate = {
        first_name: value.first_name.trim(),
        middle_name: value.middle_name.trim() || null,
        last_name: value.last_name.trim(),
        date_of_birth: value.date_of_birth,
        gender: value.gender as Gender,
        citizenship: value.citizenship,
        document_type: value.document_type as DocumentType,
        document_number: value.document_number.trim(),
        document_issuing_country: value.document_issuing_country,
        pin_egn: isBG ? value.pin_egn.trim() : null,
      };

      try {
        await onSubmit(payload);
      } catch (err: unknown) {
        // The backend EGN-vs-DOB/gender cross-check (and any other server-side
        // rule) surfaces here as a form-level 422 — never a field-level error.
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          setFormError(c.errors.duplicateSlot.value);
        } else {
          setFormError(c.errors.generic.value);
        }
      }
    },
  });

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <form.Field
          name="first_name"
          validators={{
            onBlur: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, first_name: value },
                "first_name",
              ),
            onSubmit: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, first_name: value },
                "first_name",
              ),
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{c.fields.firstName}</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldErrors field={field} />
            </Field>
          )}
        />

        <form.Field
          name="middle_name"
          validators={{
            onChangeListenTo: ["citizenship"],
            onBlur: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, middle_name: value },
                "middle_name",
              ),
            onSubmit: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, middle_name: value },
                "middle_name",
              ),
          }}
          children={(field) => {
            const isBG = field.form.state.values.citizenship === "BG";
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  {c.fields.middleName}{" "}
                  {isBG && <span className="text-destructive">*</span>}
                </FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldErrors field={field} />
              </Field>
            );
          }}
        />

        <form.Field
          name="last_name"
          validators={{
            onBlur: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, last_name: value },
                "last_name",
              ),
            onSubmit: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, last_name: value },
                "last_name",
              ),
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{c.fields.lastName}</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldErrors field={field} />
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="date_of_birth"
          validators={{
            onBlur: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, date_of_birth: value },
                "date_of_birth",
              ),
            onSubmit: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, date_of_birth: value },
                "date_of_birth",
              ),
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{c.fields.dateOfBirth}</FieldLabel>
              <Input
                id={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldErrors field={field} />
            </Field>
          )}
        />

        <form.Field
          name="gender"
          validators={{
            onBlur: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, gender: value },
                "gender",
              ),
            onSubmit: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, gender: value },
                "gender",
              ),
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{c.fields.gender}</FieldLabel>
              <select
                id={field.name}
                className={inputCls}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value as Gender | "")
                }
              >
                <option value="">{c.select.value}</option>
                <option value="male">{c.genderOptions.male.value}</option>
                <option value="female">{c.genderOptions.female.value}</option>
                <option value="other">{c.genderOptions.other.value}</option>
              </select>
              <FieldErrors field={field} />
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="citizenship"
          validators={{
            onBlur: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, citizenship: value },
                "citizenship",
              ),
            onSubmit: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, citizenship: value },
                "citizenship",
              ),
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{c.fields.citizenship}</FieldLabel>
              <select
                id={field.name}
                className={inputCls}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="">{c.select.value}</option>
                {countryOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <FieldErrors field={field} />
            </Field>
          )}
        />

        <form.Field
          name="document_issuing_country"
          validators={{
            onBlur: ({ value, fieldApi }) =>
              fieldError(
                {
                  ...fieldApi.form.state.values,
                  document_issuing_country: value,
                },
                "document_issuing_country",
              ),
            onSubmit: ({ value, fieldApi }) =>
              fieldError(
                {
                  ...fieldApi.form.state.values,
                  document_issuing_country: value,
                },
                "document_issuing_country",
              ),
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                {c.fields.documentIssuingCountry}
              </FieldLabel>
              <select
                id={field.name}
                className={inputCls}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="">{c.select.value}</option>
                {countryOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <FieldErrors field={field} />
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="document_type"
          validators={{
            onBlur: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, document_type: value },
                "document_type",
              ),
            onSubmit: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, document_type: value },
                "document_type",
              ),
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{c.fields.documentType}</FieldLabel>
              <select
                id={field.name}
                className={inputCls}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value as DocumentType | "")
                }
              >
                <option value="">{c.select.value}</option>
                <option value="id_card">{c.documentTypeOptions.idCard.value}</option>
                <option value="passport">{c.documentTypeOptions.passport.value}</option>
              </select>
              <FieldErrors field={field} />
            </Field>
          )}
        />

        <form.Field
          name="document_number"
          validators={{
            onBlur: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, document_number: value },
                "document_number",
              ),
            onSubmit: ({ value, fieldApi }) =>
              fieldError(
                { ...fieldApi.form.state.values, document_number: value },
                "document_number",
              ),
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{c.fields.documentNumber}</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                autoComplete="off"
              />
              <FieldErrors field={field} />
            </Field>
          )}
        />
      </div>

      <form.Subscribe
        selector={(state) => state.values.citizenship === "BG"}
        children={(isBG) =>
          isBG && (
            <form.Field
              name="pin_egn"
              validators={{
                onChangeListenTo: ["citizenship"],
                onBlur: ({ value, fieldApi }) =>
                  fieldError(
                    { ...fieldApi.form.state.values, pin_egn: value },
                    "pin_egn",
                  ),
                onSubmit: ({ value, fieldApi }) =>
                  fieldError(
                    { ...fieldApi.form.state.values, pin_egn: value },
                    "pin_egn",
                  ),
              }}
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{c.fields.egn}</FieldLabel>
                  <Input
                    id={field.name}
                    inputMode="numeric"
                    maxLength={10}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="off"
                  />
                  <FieldErrors field={field} />
                </Field>
              )}
            />
          )
        }
      />

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          className="mt-0.5"
        />
        <span>
          {c.consent.prefix}{" "}
          <Link
            to={"/terms-and-conditions" as never}
            className="text-primary underline underline-offset-2"
          >
            {c.consent.terms}
          </Link>{" "}
          {c.consent.and}{" "}
          <Link
            to={"/privacy-policy" as never}
            className="text-primary underline underline-offset-2"
          >
            {c.consent.privacy}
          </Link>
          .
        </span>
      </label>

      {formError && (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={!consent || submitting}>
          {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {c.submit}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {c.cancel}
        </Button>
      </div>
    </form>
  );
}
