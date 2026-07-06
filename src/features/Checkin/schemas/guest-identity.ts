import { z } from "zod";
import { isValidEGN } from "../lib/egn";

const nameSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[\p{L}\s\-']+$/u);

/**
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
      .date()
      .max(new Date())
      .min(new Date("1900-01-01")),
    gender: z.enum(["male", "female", "other"]),
    citizenship: z.string().length(2),
    document_type: z.enum(["id_card", "passport"]),
    document_number: z
      .string()
      .min(5)
      .max(20)
      .regex(/^[A-Za-z0-9]+$/),
    document_issuing_country: z.string().length(2),
    pin_egn: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.citizenship === "BG") {
      if (!data.middle_name || data.middle_name.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Middle name is required for Bulgarian citizens",
          path: ["middle_name"],
        });
      }
      if (!data.pin_egn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "EGN is required for Bulgarian citizens",
          path: ["pin_egn"],
        });
      } else if (!isValidEGN(data.pin_egn)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid EGN checksum or format",
          path: ["pin_egn"],
        });
      }
    }
  });

export type GuestIdentityInput = z.input<typeof guestIdentitySchema>;
