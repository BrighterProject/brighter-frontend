import { useState } from "react";
import { useIntlayer } from "react-intlayer";
import {
  CheckCircle2,
  Loader2,
  Lock,
  ShieldCheck,
  UserPlus,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useAddGuest,
  useCheckinRoster,
  useClearGuest,
} from "../api/hooks";
import type { GuestIdentityCreate, GuestRosterSlot } from "../api/types";
import { GuestForm } from "./guest-form";

interface CheckinLobbyProps {
  token: string;
  locale: string;
}

function formatDateRange(start: string, end: string, locale: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const s = new Date(start).toLocaleDateString(locale, opts);
  const e = new Date(end).toLocaleDateString(locale, opts);
  return `${s} – ${e}`;
}

export function CheckinLobby({ token, locale }: CheckinLobbyProps) {
  const { data, isPending, isError } = useCheckinRoster(token);
  const addGuest = useAddGuest(token);
  const clearGuest = useClearGuest(token);
  const [addingIndex, setAddingIndex] = useState<number | null>(null);
  const c = useIntlayer("checkin-lobby");

  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">{c.loading}</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="size-8 text-destructive" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {c.invalid.title}
        </h1>
        <p className="max-w-sm text-balance text-sm text-muted-foreground">
          {c.invalid.description}
        </p>
      </div>
    );
  }

  const handleAdd = async (payload: GuestIdentityCreate) => {
    await addGuest.mutateAsync(payload);
    setAddingIndex(null);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {c.heading}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {data.property_name}
          {data.property_city ? `, ${data.property_city}` : ""} ·{" "}
          {formatDateRange(data.start_date, data.end_date, locale)}
        </p>
        <p className="mt-2 text-sm font-medium">
          {c.guestsCompleted.value
            .replace("{filled}", String(data.filled_slots))
            .replace("{total}", String(data.total_slots))}
        </p>
      </header>

      <div className="mb-6 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
        <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>{c.encryptionNotice}</span>
      </div>

      <ul className="space-y-3">
        {data.roster.map((slot, index) => (
          <RosterRow
            key={slot.guest_id ?? `open-${index}`}
            slot={slot}
            index={index}
            isAdding={addingIndex === index}
            onOpenAdd={() => setAddingIndex(index)}
            onCloseAdd={() => setAddingIndex(null)}
            onClear={() =>
              slot.guest_id && clearGuest.mutate(slot.guest_id)
            }
            clearing={clearGuest.isPending}
            submitting={addGuest.isPending}
            onSubmit={handleAdd}
            locale={locale}
          />
        ))}
      </ul>
    </div>
  );
}

interface RosterRowProps {
  slot: GuestRosterSlot;
  index: number;
  isAdding: boolean;
  onOpenAdd: () => void;
  onCloseAdd: () => void;
  onClear: () => void;
  clearing: boolean;
  submitting: boolean;
  onSubmit: (payload: GuestIdentityCreate) => Promise<void>;
  locale: string;
}

function RosterRow({
  slot,
  index,
  isAdding,
  onOpenAdd,
  onCloseAdd,
  onClear,
  clearing,
  submitting,
  onSubmit,
  locale,
}: RosterRowProps) {
  const c = useIntlayer("checkin-lobby");

  if (slot.filled) {
    const name = [slot.first_name, slot.middle_name, slot.last_name]
      .filter(Boolean)
      .join(" ");
    return (
      <Card className="flex flex-row items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-5 text-chart-4" />
          <span className="font-medium">{name}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={clearing}
        >
          {c.remove}
        </Button>
      </Card>
    );
  }

  if (isAdding) {
    return (
      <Card className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <h2 className="font-semibold">
            {c.guestDetailsLabel.value.replace("{n}", String(index + 1))}
          </h2>
        </div>
        <GuestForm
          locale={locale}
          submitting={submitting}
          onSubmit={onSubmit}
          onCancel={onCloseAdd}
        />
      </Card>
    );
  }

  return (
    <Card className="flex flex-row items-center justify-between gap-3 p-4">
      <span className="text-muted-foreground">
        {c.guestLabel.value.replace("{n}", String(index + 1))}
      </span>
      <Button variant="outline" size="sm" onClick={onOpenAdd}>
        <UserPlus className="mr-2 size-4" />
        {c.addDetails}
      </Button>
    </Card>
  );
}
