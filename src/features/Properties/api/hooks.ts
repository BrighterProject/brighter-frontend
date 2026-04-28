import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type {
  DatePriceOverride,
  PriceResolutionResponse,
  PropertyListItem,
  PropertyResponse,
  PropertyUnavailabilityResponse,
  WeekdayPriceOut,
} from "./types";

const PAGE_SIZE = 20;

export const useProperties = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PropertyListItem[]>("/properties/", {
        params,
      });
      return data;
    },
  });
};

export const useProperty = (propertyId: string, lang?: string) => {
  return useQuery({
    queryKey: ["properties", propertyId, lang],
    queryFn: async () => {
      const { data } = await apiClient.get<PropertyResponse>(`/properties/${propertyId}`, {
        params: lang ? { lang } : undefined,
      });
      return data;
    },
    enabled: !!propertyId,
  });
};

// export const useCreateProperty = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (newProperty: PropertyCreate) => {
//       const { data } = await apiClient.post<PropertyResponse>(
//         "/properties/",
//         newProperty,
//       );
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["properties"] });
//     },
//   });
// };
//
// export const useUpdateProperty = (propertyId: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (updateData: Partial<PropertyCreate>) => {
//       const { data } = await apiClient.patch<PropertyResponse>(
//         `/properties/${propertyId}`,
//         updateData,
//       );
//       return data;
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["properties"] });
//       queryClient.setQueryData(["properties", propertyId], data);
//     },
//   });
// };
//
// // --- PROPERTY IMAGES ---
//
// export const usePropertyImages = (propertyId: string) => {
//   return useQuery({
//     queryKey: ["properties", propertyId, "images"],
//     queryFn: async () => {
//       const { data } = await apiClient.get<PropertyImageResponse[]>(
//         `/properties/${propertyId}/images`,
//       );
//       return data;
//     },
//     enabled: !!propertyId,
//   });
// };
//
// export const useReorderImages = (propertyId: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (orderedIds: string[]) => {
//       const { data } = await apiClient.put<PropertyImageResponse[]>(
//         `/properties/${propertyId}/images/reorder`,
//         orderedIds,
//       );
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["properties", propertyId] });
//     },
//   });
// };
//
// // --- UNAVAILABILITIES ---

export const useInfiniteProperties = (params?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ["properties", "infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get<PropertyListItem[]>("/properties/", {
        params: { ...params, page: pageParam, page_size: PAGE_SIZE },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === PAGE_SIZE ? (lastPageParam as number) + 1 : undefined,
  });
};

export const usePropertyUnavailabilities = (propertyId: string) => {
  return useQuery({
    queryKey: ["properties", propertyId, "unavailabilities"],
    queryFn: async () => {
      const { data } = await apiClient.get<PropertyUnavailabilityResponse[]>(
        `/properties/${propertyId}/unavailabilities`,
      );
      return data;
    },
    enabled: !!propertyId,
  });
};

// export const useCreateUnavailability = (propertyId: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (payload: {
//       start_date: string;
//       end_date: string;
//       reason?: string;
//     }) => {
//       const { data } = await apiClient.post(
//         `/properties/${propertyId}/unavailabilities`,
//         payload,
//       );
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["properties", propertyId] });
//     },
//   });
// };

// ---------------------------------------------------------------------------
// Pricing — public resolve
// ---------------------------------------------------------------------------

export const usePriceResolution = (
  propertyId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: ["properties", propertyId, "pricing", "resolve", startDate, endDate],
    queryFn: async () => {
      const { data } = await apiClient.get<PriceResolutionResponse>(
        `/properties/${propertyId}/pricing/resolve`,
        { params: { start_date: startDate, end_date: endDate } },
      );
      return data;
    },
    enabled: !!propertyId && !!startDate && !!endDate,
    staleTime: 30_000,
  });
};

// ---------------------------------------------------------------------------
// Pricing — owner weekday prices
// ---------------------------------------------------------------------------

export const useWeekdayPrices = (propertyId: string) => {
  return useQuery({
    queryKey: ["properties", propertyId, "pricing", "weekdays"],
    queryFn: async () => {
      const { data } = await apiClient.get<WeekdayPriceOut[]>(
        `/properties/${propertyId}/pricing/weekdays`,
      );
      return data;
    },
    enabled: !!propertyId,
  });
};

export const useUpsertWeekdayPrices = (propertyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rules: { weekday: number; price: string }[]) => {
      const { data } = await apiClient.put<WeekdayPriceOut[]>(
        `/properties/${propertyId}/pricing/weekdays`,
        rules,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties", propertyId, "pricing"],
      });
    },
  });
};

// ---------------------------------------------------------------------------
// Pricing — owner date overrides
// ---------------------------------------------------------------------------

export const useDateOverrides = (propertyId: string) => {
  return useQuery({
    queryKey: ["properties", propertyId, "pricing", "overrides"],
    queryFn: async () => {
      const { data } = await apiClient.get<DatePriceOverride[]>(
        `/properties/${propertyId}/pricing/overrides`,
      );
      return data;
    },
    enabled: !!propertyId,
  });
};

export const useCreateDateOverride = (propertyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      start_date: string;
      end_date: string;
      price: string;
      label?: string | null;
    }) => {
      const { data } = await apiClient.post<DatePriceOverride>(
        `/properties/${propertyId}/pricing/overrides`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties", propertyId, "pricing"],
      });
    },
  });
};

export const useUpdateDateOverride = (propertyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      overrideId,
      ...payload
    }: {
      overrideId: string;
      start_date?: string;
      end_date?: string;
      price?: string;
      label?: string | null;
    }) => {
      const { data } = await apiClient.patch<DatePriceOverride>(
        `/properties/${propertyId}/pricing/overrides/${overrideId}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties", propertyId, "pricing"],
      });
    },
  });
};

export const useDeleteDateOverride = (propertyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (overrideId: string) => {
      await apiClient.delete(
        `/properties/${propertyId}/pricing/overrides/${overrideId}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["properties", propertyId, "pricing"],
      });
    },
  });
};
