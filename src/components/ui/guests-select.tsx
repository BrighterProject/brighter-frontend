import { Users, ChevronDown } from "lucide-react";

interface GuestsSelectProps {
  label: React.ReactNode;
}

export function GuestsSelect({ label }: GuestsSelectProps) {
  return (
    <div className="flex h-12 items-center rounded-lg border border-border bg-background px-3 shadow-xs">
      <Users className="mr-2 size-5 text-muted-foreground" />
      <span className="flex-1 text-sm text-foreground">{label}</span>
      <ChevronDown className="size-4 text-foreground" />
    </div>
  );
}
