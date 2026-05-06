import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { BankAccountResponse, BankAccountUpsert, ConnectStatus, PaymentCapabilities } from "./types";
import type { PaymentConfig } from "@Properties/api/types";

export const usePaymentCapabilities = () =>
  useQuery({
    queryKey: ["payments", "capabilities"],
    queryFn: async () => {
      const { data } = await apiClient.get<PaymentCapabilities>("/payments/capabilities");
      return data;
    },
    retry: false,
  });

export const useConnectStatus = () =>
  useQuery({
    queryKey: ["payments", "connect", "status"],
    queryFn: async () => {
      const { data } = await apiClient.get<ConnectStatus>("/payments-connect/status");
      return data;
    },
    retry: false,
  });

export const useMyBankAccount = () =>
  useQuery({
    queryKey: ["payments", "bank-account"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<BankAccountResponse>("/payments/bank-account/");
        return data;
      } catch (e: unknown) {
        if ((e as { response?: { status: number } })?.response?.status === 404) return null;
        throw e;
      }
    },
    retry: false,
  });

export const useUpsertBankAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BankAccountUpsert) => {
      const { data } = await apiClient.put<BankAccountResponse>("/payments/bank-account/", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payments", "bank-account"] });
      qc.invalidateQueries({ queryKey: ["payments", "capabilities"] });
    },
  });
};

export const useUpdatePropertyPaymentConfig = (propertyId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payment_config: PaymentConfig) => {
      const { data } = await apiClient.patch(`/properties/${propertyId}`, { payment_config });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties", propertyId] });
    },
  });
};
