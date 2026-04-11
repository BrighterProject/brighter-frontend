import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type {
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
