import {
  useQuery,
  useInfiniteQuery,
  useQueries,
  keepPreviousData,
} from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type {
  DatePrice,
  PriceResolutionResponse,
  PricingCoverageResponse,
  PropertyListItem,
  PropertyResponse,
  PropertyUnavailabilityResponse,
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

export const usePropertiesForBookings = (
  propertyIds: string[],
  locale?: string,
) => {
  const uniqueIds = [...new Set(propertyIds.filter(Boolean))];
  const results = useQueries({
    queries: uniqueIds.map((id) => ({
      queryKey: ["properties", id, locale],
      queryFn: async () => {
        const { data } = await apiClient.get<PropertyResponse>(
          `/properties/${id}`,
          { params: locale ? { lang: locale } : undefined },
        );
        return data;
      },
      staleTime: 5 * 60 * 1000,
    })),
  });
  return {
    propertiesById: new Map(
      uniqueIds.map((id, i) => [id, results[i]?.data ?? null]),
    ),
    isLoading: results.some((r) => r.isLoading),
  };
};

export interface PropertiesPage {
  items: PropertyListItem[];
  total: number;
}

/**
 * Whether another page exists, derived from the real match total (X-Total-Count)
 * rather than "was the last page full" — the latter fires a phantom empty
 * request whenever the final page is exactly `page_size` long.
 */
export function nextInfinitePage(
  loaded: number,
  total: number,
  lastPageParam: number,
): number | undefined {
  return loaded < total ? lastPageParam + 1 : undefined;
}

export const useInfiniteProperties = (params?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ["properties", "infinite", params],
    queryFn: async ({ pageParam = 1 }): Promise<PropertiesPage> => {
      const res = await apiClient.get<PropertyListItem[]>("/properties/", {
        params: { ...params, page: pageParam, page_size: PAGE_SIZE },
      });
      const headerTotal = Number(res.headers["x-total-count"]);
      return {
        items: res.data,
        total: Number.isFinite(headerTotal) ? headerTotal : res.data.length,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const loaded = allPages.reduce((n, page) => n + page.items.length, 0);
      return nextInfinitePage(loaded, lastPage.total, lastPageParam as number);
    },
    // Keep the previous result mounted during a filter-triggered refetch so
    // cards don't unmount/flash while the user drags the price slider.
    placeholderData: keepPreviousData,
  });
};

export const usePropertyUnavailabilities = (propertyId: string) => {
  return useQuery({
    queryKey: ["properties", propertyId, "unavailabilities"],
    queryFn: async () => {
      // Real owner-set blocks only. Unpriced days come from the pricing-coverage
      // endpoint (usePricingCoverage) and are merged in by the caller.
      const { data } = await apiClient.get<PropertyUnavailabilityResponse[]>(
        `/properties/${propertyId}/unavailabilities`,
      );
      return data;
    },
    enabled: !!propertyId,
  });
};

/**
 * Unpriced-day windows for a property over `[start, end)`. Used to disable
 * unbookable days in the date picker (a day with no price cannot be booked).
 */
export const usePricingCoverage = (
  propertyId: string,
  start: string,
  end: string,
) => {
  return useQuery({
    queryKey: ["properties", propertyId, "coverage", start, end],
    queryFn: async () => {
      const { data } = await apiClient.get<PricingCoverageResponse>(
        `/properties/${propertyId}/pricing/coverage`,
        { params: { start, end } },
      );
      return data.unpriced_windows;
    },
    enabled: !!propertyId && !!start && !!end,
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
// Pricing — per-date rows
// ---------------------------------------------------------------------------

/**
 * The property's priced nights over `[from, to]` (inclusive), one row per date.
 * A date with no row is unpriced and therefore unavailable. Used to render the
 * per-night price on the date picker and total up a selected stay.
 */
export const useDatePrices = (
  propertyId: string,
  from?: string,
  to?: string,
) => {
  return useQuery({
    queryKey: ["properties", propertyId, "pricing", "dates", from, to],
    queryFn: async () => {
      const { data } = await apiClient.get<DatePrice[]>(
        `/properties/${propertyId}/pricing/dates`,
        { params: { from_date: from, to_date: to } },
      );
      return data;
    },
    enabled: !!propertyId && !!from && !!to,
    staleTime: 30_000,
  });
};
