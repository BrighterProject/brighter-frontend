import { useMemo, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LocalizedLink as Link } from "@/components/ui/localized-link";
import { guestIdentitySchema } from "../schemas/guest-identity";
import type {
  DocumentType,
  Gender,
  GuestIdentityCreate,
} from "../api/types";
import { COUNTRY_CODES } from "../lib/countries";

interface GuestFormProps {
  locale: string;
  submitting: boolean;
  onSubmit: (payload: GuestIdentityCreate) => Promise<void>;
  onCancel: () => void;
}

interface FormState {
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

const EMPTY: FormState = {
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

export function GuestForm({
  locale,
  submitting,
  onSubmit,
  onCancel,
}: GuestFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const isBG = form.citizenship === "BG";

  const countryOptions = useMemo(() => {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    return COUNTRY_CODES.map((code) => ({
      code,
      name: dn.of(code) ?? code,
    })).sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  const setField = <K extends keyof FormState>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsed = guestIdentitySchema.safeParse({
      ...form,
      middle_name: form.middle_name || undefined,
      pin_egn: form.pin_egn || undefined,
    });

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    const payload: GuestIdentityCreate = {
      first_name: form.first_name.trim(),
      middle_name: form.middle_name.trim() || null,
      last_name: form.last_name.trim(),
      date_of_birth: form.date_of_birth,
      gender: form.gender as Gender,
      citizenship: form.citizenship,
      document_type: form.document_type as DocumentType,
      document_number: form.document_number.trim(),
      document_issuing_country: form.document_issuing_country,
      pin_egn: isBG ? form.pin_egn.trim() : null,
    };

    try {
      await onSubmit(payload);
    } catch (err: unknown) {
      // The backend EGN-vs-DOB/gender cross-check (and any other server-side
      // rule) surfaces here as a form-level 422 — never a field-level error.
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setFormError("All guest slots for this booking are already filled.");
      } else {
        setFormError(
          "We could not save these details. Please double-check the ID number, EGN, date of birth, and gender, then try again.",
        );
      }
    }
  };

  const err = (key: string) =>
    fieldErrors[key] ? (
      <p className="mt-1 text-xs text-destructive">{fieldErrors[key]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            value={form.first_name}
            onChange={(e) => setField("first_name", e.target.value)}
          />
          {err("first_name")}
        </div>
        <div>
          <Label htmlFor="middle_name">
            Middle name {isBG && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="middle_name"
            value={form.middle_name}
            onChange={(e) => setField("middle_name", e.target.value)}
          />
          {err("middle_name")}
        </div>
        <div>
          <Label htmlFor="last_name">Last name</Label>
          <Input
            id="last_name"
            value={form.last_name}
            onChange={(e) => setField("last_name", e.target.value)}
          />
          {err("last_name")}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="date_of_birth">Date of birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={(e) => setField("date_of_birth", e.target.value)}
          />
          {err("date_of_birth")}
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            className={inputCls}
            value={form.gender}
            onChange={(e) => setField("gender", e.target.value)}
          >
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {err("gender")}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="citizenship">Citizenship</Label>
          <select
            id="citizenship"
            className={inputCls}
            value={form.citizenship}
            onChange={(e) => setField("citizenship", e.target.value)}
          >
            <option value="">Select…</option>
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {err("citizenship")}
        </div>
        <div>
          <Label htmlFor="document_issuing_country">
            Document issuing country
          </Label>
          <select
            id="document_issuing_country"
            className={inputCls}
            value={form.document_issuing_country}
            onChange={(e) =>
              setField("document_issuing_country", e.target.value)
            }
          >
            <option value="">Select…</option>
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {err("document_issuing_country")}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="document_type">Document type</Label>
          <select
            id="document_type"
            className={inputCls}
            value={form.document_type}
            onChange={(e) => setField("document_type", e.target.value)}
          >
            <option value="">Select…</option>
            <option value="id_card">ID card</option>
            <option value="passport">Passport</option>
          </select>
          {err("document_type")}
        </div>
        <div>
          <Label htmlFor="document_number">Document number</Label>
          <Input
            id="document_number"
            value={form.document_number}
            onChange={(e) => setField("document_number", e.target.value)}
            autoComplete="off"
          />
          {err("document_number")}
        </div>
      </div>

      {isBG && (
        <div>
          <Label htmlFor="pin_egn">EGN (national ID number)</Label>
          <Input
            id="pin_egn"
            inputMode="numeric"
            maxLength={10}
            value={form.pin_egn}
            onChange={(e) => setField("pin_egn", e.target.value)}
            autoComplete="off"
          />
          {err("pin_egn")}
        </div>
      )}

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          className="mt-0.5"
        />
        <span>
          I agree to the{" "}
          <Link
            to={"/terms-and-conditions" as never}
            className="text-primary underline underline-offset-2"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to={"/privacy-policy" as never}
            className="text-primary underline underline-offset-2"
          >
            Privacy Policy
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
          Save details
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
