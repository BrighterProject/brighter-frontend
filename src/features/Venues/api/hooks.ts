import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type {
  PropertyListItem,
  PropertyResponse,
  PropertyUnavailabilityResponse,
} from "./types";

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

export const useProperty = (propertyId: string) => {
  return useQuery({
    queryKey: ["properties", propertyId],
    queryFn: async () => {
      const { data } = await apiClient.get<PropertyResponse>(`/properties/${propertyId}`);
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
//       start_datetime: string;
//       end_datetime: string;
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
