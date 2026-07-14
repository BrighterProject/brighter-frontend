import { describe, it, expect } from "vitest";
import { guestIdentitySchema } from "../schemas/guest-identity";

const validBG = {
  first_name: "Ivan",
  middle_name: "Petrov",
  last_name: "Ivanov",
  date_of_birth: "1990-01-01",
  gender: "male",
  citizenship: "BG",
  document_type: "id_card",
  document_number: "AB12345",
  document_issuing_country: "BG",
  pin_egn: "8001010034", // valid EGN checksum
};

// Mirrors fieldError()'s transformation in guest-form.tsx
function parse(values: Record<string, unknown>) {
  return guestIdentitySchema.safeParse({
    ...values,
    middle_name: values.middle_name || undefined,
    pin_egn: values.pin_egn || undefined,
  });
}

function pinIssue(values: Record<string, unknown>): boolean {
  const r = parse(values);
  return !r.success && r.error.issues.some((i) => i.path[0] === "pin_egn");
}

describe("guestIdentitySchema personal-number gate", () => {
  it("accepts a valid BG citizen with a valid EGN", () => {
    expect(parse(validBG).success).toBe(true);
  });

  it("requires the personal number when the document is BG-issued, even for foreigners", () => {
    const foreigner = {
      ...validBG,
      citizenship: "RU",
      middle_name: "",
      pin_egn: "",
    };
    expect(pinIssue(foreigner)).toBe(true);
  });

  it("accepts a foreigner with a BG-issued document and a valid LNCh", () => {
    const foreigner = {
      ...validBG,
      citizenship: "RU",
      middle_name: "",
      pin_egn: "1000000001", // valid LNCh (not a valid EGN)
    };
    expect(parse(foreigner).success).toBe(true);
  });

  it("does not require a personal number for a foreign-issued document", () => {
    const foreign = {
      ...validBG,
      citizenship: "RU",
      middle_name: "",
      document_issuing_country: "GB",
      document_type: "passport",
      pin_egn: "",
    };
    expect(parse(foreign).success).toBe(true);
  });

  it("rejects an invalid EGN/LNCh checksum", () => {
    expect(pinIssue({ ...validBG, pin_egn: "8001010035" })).toBe(true);
  });

  it("rejects a non-numeric personal number", () => {
    expect(pinIssue({ ...validBG, pin_egn: "abcdefghij" })).toBe(true);
  });
});
