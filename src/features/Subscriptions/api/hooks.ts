import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type {
  CheckoutResponse,
  OwnerSubscription,
  PortalResponse,
  SubscriptionPlan,
} from "./types";

export const usePlans = () =>
  useQuery({
    queryKey: ["subscriptions", "plans"],
    queryFn: async () => {
      const { data } = await apiClient.get<SubscriptionPlan[]>(
        "/payments/subscriptions/plans",
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useMySubscription = (enabled = true) =>
  useQuery({
    queryKey: ["subscriptions", "me"],
    queryFn: async () => {
      const { data } =
        await apiClient.get<OwnerSubscription>("/payments/subscriptions/me");
      return data;
    },
    enabled,
    retry: false,
  });

export const useCheckout = () =>
  useMutation({
    mutationFn: async ({
      planSlug,
      locale,
    }: {
      planSlug: string;
      locale: string;
    }) => {
      const { data } = await apiClient.post<CheckoutResponse>(
        `/payments/subscriptions/checkout`,
        null,
        { params: { plan_slug: planSlug, locale } },
      );
      return data;
    },
  });

export const usePortal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ locale }: { locale: string }) => {
      const { data } = await apiClient.post<PortalResponse>(
        "/payments/subscriptions/portal",
        null,
        { params: { locale } },
      );
      return data;
    },
    onSuccess: ({ portal_url }) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "me"] });
      window.open(portal_url, "_blank", "noopener,noreferrer");
    },
  });
};
