import { useRef, useState, useEffect } from "react";
import { useIntlayer } from "react-intlayer";
import { Users, ChevronDown, Plus, Minus } from "lucide-react";

interface GuestsSelectProps {
  adults?: number;
  children?: number;
  onAdultsChange?: (value: number) => void;
  onChildrenChange?: (value: number) => void;
  compact?: boolean;
}

function Counter({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
}: {
  label: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="flex size-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-medium text-foreground">
          {value}
        </span>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="flex size-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function GuestsSelect({
  adults: controlledAdults,
  children: controlledChildren,
  onAdultsChange,
  onChildrenChange,
  compact = false,
}: GuestsSelectProps) {
  const [open, setOpen] = useState(false);
  const [internalAdults, setInternalAdults] = useState(2);
  const [internalChildren, setInternalChildren] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const content = useIntlayer("guests-select");

  const adults = controlledAdults ?? internalAdults;
  const childrenCount = controlledChildren ?? internalChildren;

  const handleAdultsChange = onAdultsChange ?? setInternalAdults;
  const handleChildrenChange = onChildrenChange ?? setInternalChildren;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const adultsLabel =
    adults === 1 ? content.summary.adult : content.summary.adults;
  const childrenLabel =
    childrenCount === 1 ? content.summary.child : content.summary.children;

  const label =
    childrenCount > 0
      ? `${adults} ${adultsLabel.value}, ${childrenCount} ${childrenLabel.value}`
      : `${adults} ${adultsLabel.value}`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center rounded-lg border border-border bg-background px-3 shadow-xs ${compact ? "h-10" : "h-12"}`}
      >
        <Users className="mr-2 size-5 text-muted-foreground" />
        <span className="flex-1 text-left text-sm text-foreground">
          {label}
        </span>
        <ChevronDown
          className={`size-4 text-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-52 w-full rounded-lg border border-border bg-background p-4 shadow-md">
          <Counter
            label={content.adults}
            value={adults}
            onChange={handleAdultsChange}
            min={1}
          />
          <div className="h-px bg-border" />
          <Counter
            label={content.children}
            value={childrenCount}
            onChange={handleChildrenChange}
          />
        </div>
      )}
    </div>
  );
}
