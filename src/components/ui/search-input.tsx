import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  icon: LucideIcon;
  placeholder: string;
  type?: "date";
}

export function SearchInput({ icon: Icon, placeholder, type }: SearchInputProps) {
  const isDate = type === "date";

  return (
    <div className="relative">
      <Icon className="absolute left-2.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="h-12 pl-9 text-sm shadow-xs"
        type={isDate ? "text" : undefined}
        onFocus={isDate ? (e) => (e.target.type = "date") : undefined}
        onBlur={
          isDate
            ? (e) => {
                if (!e.target.value) e.target.type = "text";
              }
            : undefined
        }
      />
    </div>
  );
}
