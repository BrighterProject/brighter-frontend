import { z } from "zod";
import { isValidBgPersonalNumber } from "../lib/egn";

const nameSchema = z
  .string()
  .min(2, "name_too_short")
  .max(100, "name_too_long")
  .regex(/^[\p{L}\s\-']+$/u, "name_invalid_format");

/**
 * `message` strings below are error CODES, not user-facing text — they are
 * looked up in guest-form.content.ts's `errors.validation` map (see
 * validationMessages in guest-form.tsx) so messages can be translated. Never
 * put raw English text here; untranslated Zod defaults previously leaked to
 * the UI (e.g. "Too small: expected string to have >=5 characters").
 *
 * Client-side guest-identity validation. Mirrors (but does not replace) the
 * bookings-ms Phase 4.2/BTR-15 validators — the backend is always the source
 * of truth; this is fast feedback only. The EGN-vs-DOB/gender cross-check is
 * intentionally omitted (backend-only) and surfaces as a form-level 422.
 */
export const guestIdentitySchema = z
  .object({
    first_name: nameSchema,
    middle_name: z.string().optional(),
    last_name: nameSchema,
    date_of_birth: z.coerce
      .date({ error: "dob_required" })
      .max(new Date(), "dob_future")
      .min(new Date("1900-01-01"), "dob_too_early"),
    gender: z.enum(["male", "female", "other"], "selection_required"),
    citizenship: z.string().length(2, "country_invalid"),
    document_type: z.enum(["id_card", "passport"], "selection_required"),
    document_number: z
      .string()
      .min(5, "document_number_too_short")
      .max(20, "document_number_too_long")
      .regex(/^[A-Za-z0-9]+$/, "document_number_invalid_format"),
    document_issuing_country: z.string().length(2, "country_invalid"),
    pin_egn: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Middle name (бащино име) is a naming convention of Bulgarian citizens.
    if (data.citizenship === "BG") {
      if (!data.middle_name || data.middle_name.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "middle_name_required_bg",
          path: ["middle_name"],
        });
      }
    }
    // A Bulgarian-issued document carries a personal number — EGN for citizens
    // (and permanent-resident foreigners) or LNCh for long-term-resident
    // foreigners — so gate on the issuing country, not citizenship.
    if (data.document_issuing_country === "BG") {
      if (!data.pin_egn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "egn_required_bg",
          path: ["pin_egn"],
        });
      } else if (!isValidBgPersonalNumber(data.pin_egn)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "egn_invalid_bg",
          path: ["pin_egn"],
        });
      }
    }
  });

export type GuestIdentityInput = z.input<typeof guestIdentitySchema>;
