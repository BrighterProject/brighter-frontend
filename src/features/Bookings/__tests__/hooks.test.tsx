import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import apiClient from "@/lib/api-client";
import { useMyBookings } from "../api/hooks";

vi.mock("@/lib/api-client", () => ({
  default: { get: vi.fn() },
}));

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useMyBookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests /bookings/ with view=guest so property owners get their own guest bookings", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] });

    const { result } = renderHook(() => useMyBookings(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.get).toHaveBeenCalledWith("/bookings/", {
      params: { view: "guest" },
    });
  });
});
