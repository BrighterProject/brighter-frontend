import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type {
  BookingCreate,
  BookingResponse,
  CheckoutResponse,
  OccupiedSlot,
  PaymentResponse,
} from "./types";

export const useOccupiedSlots = (propertyId: string) =>
  useQuery({
    queryKey: ["bookings", "slots", propertyId],
    queryFn: async () => {
      const { data } = await apiClient.get<OccupiedSlot[]>("/bookings/slots", {
        params: { property_id: propertyId },
      });
      return data;
    },
    enabled: !!propertyId,
  });

export const useMyBookings = () =>
  useQuery({
    queryKey: ["bookings", "mine"],
    queryFn: async () => {
      const { data } = await apiClient.get<BookingResponse[]>("/bookings/");
      return data;
    },
  });

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BookingCreate) => {
      const { data } = await apiClient.post<BookingResponse>(
        "/bookings/",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useMyPayments = () =>
  useQuery({
    queryKey: ["payments", "mine"],
    queryFn: async () => {
      const { data } = await apiClient.get<PaymentResponse[]>("/payments/");
      return data;
    },
    // Poll every 3 s while any payment is still pending (waiting for Stripe webhook).
    // Stops automatically once all payments settle to paid/failed/refunded.
    refetchInterval: (query) =>
      query.state.data?.some((p) => p.status === "pending") ? 3000 : false,
  });

export const useAbandonPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentId: string) => {
      await apiClient.post(`/payments/${paymentId}/abandon`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useCreateCheckout = (locale?: string) =>
  useMutation({
    mutationFn: async (bookingId: string) => {
      const { data } = await apiClient.post<CheckoutResponse>(
        "/payments/checkout",
        { booking_id: bookingId, locale: locale ?? null },
      );
      return data;
    },
  });

export const useBookingPayment = (bookingId: string) =>
  useQuery({
    queryKey: ["payments", "booking", bookingId],
    queryFn: async () => {
      const { data } = await apiClient.get<PaymentResponse>(
        `/payments/booking/${bookingId}`,
      );
      return data;
    },
    enabled: !!bookingId,
    retry: false,
  });

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data } = await apiClient.patch<BookingResponse>(
        `/bookings/${bookingId}/status`,
        { status: "cancelled" },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
