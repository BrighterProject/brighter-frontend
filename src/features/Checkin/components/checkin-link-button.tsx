import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Loader2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckinLink } from "../api/hooks";

interface CheckinLinkButtonProps {
  bookingId: string;
  locale: string;
  endDate: string;
  className?: string;
}

// Mirrors bookings-ms's CHECKIN_TOKEN_GRACE_DAYS default — used only to
// proactively hide this button once the link is obviously expired. The
// backend remains the source of truth (still returns 410 Gone on click if a
// deployment overrides the default), this is just a fast, optimistic check.
const CHECKIN_TOKEN_GRACE_DAYS = 1;

function isCheckinLinkExpired(endDate: string): boolean {
  const expiry = new Date(endDate);
  expiry.setDate(expiry.getDate() + CHECKIN_TOKEN_GRACE_DAYS);
  return new Date() > expiry;
}

/**
 * "Get check-in link" affordance for a confirmed booking on My Bookings.
 * Fetches the deterministic token on demand and copies the guest-facing lobby
 * URL to the clipboard. Only rendered for CONFIRMED bookings that haven't
 * passed the token's expiry window — the backend additionally returns
 * 409/410 outside the valid window, handled here as a fallback.
 */
export function CheckinLinkButton({
  bookingId,
  locale,
  endDate,
  className,
}: CheckinLinkButtonProps) {
  const { mutateAsync, isPending } = useCheckinLink();
  const [copied, setCopied] = useState(false);

  if (isCheckinLinkExpired(endDate)) return null;

  const handleClick = async () => {
    try {
      const { token } = await mutateAsync(bookingId);
      const url = `${window.location.origin}/${locale}/checkin/${token}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Check-in link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Check-in link is not available for this booking yet");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : copied ? (
        <Check className="mr-2 size-4" />
      ) : (
        <Ticket className="mr-2 size-4" />
      )}
      {copied ? "Copied" : "Check-in link"}
      {!isPending && !copied && <Copy className="ml-2 size-3.5 opacity-60" />}
    </Button>
  );
}
