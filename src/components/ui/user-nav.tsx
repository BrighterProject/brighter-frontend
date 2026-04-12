import { useMe, useLogout } from "@Auth/api/hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";
import { LocalizedLink } from "./localized-link";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import { useIntlayer } from "react-intlayer";
import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

export function UserNav({ onAction }: { onAction?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const navigate = useLocalizedNavigate();
  const { data: user, isLoading } = useMe();
  const logout = useLogout();

  const content = useIntlayer("user-nav");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    onAction?.();
    logout();
    navigate({ to: "/auth/login" });
  };

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  if (isLoading)
    return <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />;

  if (!user) {
    return (
      <Button asChild size="sm" variant="outline">
        <LocalizedLink to="/auth/login" onClick={onAction}>
          {content.labels.login}
        </LocalizedLink>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.username?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.full_name || user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.scopes?.includes("properties:me") &&
          !user.scopes?.some((s: string) => s.startsWith("admin:")) && (
          <DropdownMenuItem asChild>
            <a href="/admin/properties/new" onClick={onAction}>
              + Добави имот
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <LocalizedLink to="/bookings" onClick={onAction}>
            {content.labels.myBookings}
          </LocalizedLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <LocalizedLink to={"/settings" as any} onClick={onAction}>
            {content.labels.settings}
          </LocalizedLink>
        </DropdownMenuItem>
        {user.scopes?.some(
          (s: string) => s.startsWith("admin:") || s === "properties:me",
        ) && (
          <DropdownMenuItem asChild>
            <a href="/admin" onClick={onAction} className="gap-1.5">
              <Settings className="size-3.5" />
              {content.labels.management}
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          {content.labels.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
