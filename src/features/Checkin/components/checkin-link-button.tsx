import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Loader2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckinLink } from "../api/hooks";

interface CheckinLinkButtonProps {
  bookingId: string;
  locale: string;
  className?: string;
}

/**
 * "Get check-in link" affordance for a confirmed booking on My Bookings.
 * Fetches the deterministic token on demand and copies the guest-facing lobby
 * URL to the clipboard. Only rendered for CONFIRMED bookings — the backend
 * additionally returns 409/410 outside the valid window, handled here.
 */
export function CheckinLinkButton({
  bookingId,
  locale,
  className,
}: CheckinLinkButtonProps) {
  const { mutateAsync, isPending } = useCheckinLink();
  const [copied, setCopied] = useState(false);

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
