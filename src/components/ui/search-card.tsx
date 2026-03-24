import { Search, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { GuestsSelect } from "@/components/ui/guests-select";

interface SearchCardContent {
  destination: { value: string };
  checkIn: { value: string };
  checkOut: { value: string };
  guests: React.ReactNode;
  button: React.ReactNode;
}

interface SearchCardProps {
  content: SearchCardContent;
}

export function SearchCard({ content }: SearchCardProps) {
  return (
    <div className="relative flex flex-col gap-4 md:rounded-lg md:border md:border-border md:px-6 md:pb-12 md:pt-6 md:shadow-sm">
      <SearchInput
        icon={Search}
        placeholder={content.destination.value as string}
      />

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        <SearchInput
          icon={CalendarDays}
          placeholder={content.checkIn.value as string}
          type="date"
        />
        <SearchInput
          icon={CalendarDays}
          placeholder={content.checkOut.value as string}
          type="date"
        />
        <div className="hidden md:block">
          <GuestsSelect label={content.guests} />
        </div>
      </div>

      <div className="md:hidden">
        <GuestsSelect label={content.guests} />
      </div>

      <Button
        size="lg"
        className="h-12 w-full text-base md:absolute md:-bottom-6 md:left-1/2 md:mt-0 md:w-2/5 md:-translate-x-1/2"
      >
        {content.button}
      </Button>
    </div>
  );
}
