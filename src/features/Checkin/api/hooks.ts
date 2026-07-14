import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type {
  CheckinLinkResponse,
  GuestIdentityCreate,
  GuestRosterResponse,
  GuestRosterSlot,
} from "./types";

const rosterKey = (token: string) => ["checkin", "roster", token] as const;

/**
 * Public, unauthenticated roster fetch for a check-in token. Never retries on
 * 401 (an expired/invalid link is a terminal state the UI renders explicitly).
 */
export const useCheckinRoster = (token: string) =>
  useQuery({
    queryKey: rosterKey(token),
    queryFn: async () => {
      const { data } = await apiClient.get<GuestRosterResponse>(
        `/checkin/${token}`,
      );
      return data;
    },
    enabled: !!token,
    retry: false,
  });

export const useAddGuest = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: GuestIdentityCreate) => {
      const { data } = await apiClient.post<GuestRosterSlot>(
        `/checkin/${token}/guests`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rosterKey(token) });
    },
  });
};

export const useClearGuest = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (guestId: string) => {
      await apiClient.delete(`/checkin/${token}/guests/${guestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rosterKey(token) });
    },
  });
};

/**
 * Authenticated on-demand check-in link retrieval for the booking owner
 * ("My Bookings"). Backend gates on CONFIRMED status + non-expired window.
 */
export const useCheckinLink = () =>
  useMutation({
    mutationFn: async (bookingId: string) => {
      const { data } = await apiClient.get<CheckinLinkResponse>(
        `/bookings/${bookingId}/checkin-link`,
      );
      return data;
    },
  });
