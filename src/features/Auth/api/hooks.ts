import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type {
  UserRead,
  UserPublic,
  UserCreate,
  Token,
  UserScopesUpdate,
} from "./types";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiClient.post<Token>("/auth/token", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      localStorage.setItem("access_token", response.data.access_token);
      return response.data;
    },
  });
};

export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: async (credential: string) => {
      const response = await apiClient.post<Token>("/auth/google", {
        credential,
      });
      localStorage.setItem("access_token", response.data.access_token);
      return response.data;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("access_token");
    queryClient.clear();
  };

  return logout;
};

// --- USERS ---
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await apiClient.get<UserRead[]>("/users/");
      return data;
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<UserPublic>("/users/@me/get");
        return data;
      } catch (error: any) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("access_token");
          return null;
        }
        throw error;
      }
    },
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("access_token"),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const { data } = await apiClient.get<UserRead>(`/users/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      const { data } = await apiClient.get<{ message: string }>(
        `/auth/verify-email`,
        { params: { token } },
      );
      return data;
    },
  });
};

export const useRegisterUser = (locale: string = "bg") => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newUser: UserCreate) => {
      const { data } = await apiClient.post<UserPublic>(
        `/users/?locale=${encodeURIComponent(locale)}`,
        newUser,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      await apiClient.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// --- SCOPES ---
export const useAllScopes = () => {
  return useQuery({
    queryKey: ["scopes"],
    queryFn: async () => {
      const { data } = await apiClient.get<string[]>("/scopes/");
      return data;
    },
  });
};

export const useUserScopes = (userId: number) => {
  return useQuery({
    queryKey: ["users", userId, "scopes"],
    queryFn: async () => {
      const { data } = await apiClient.get<UserScopesUpdate>(
        `/users/${userId}/scopes`,
      );
      return data;
    },
    enabled: !!userId,
  });
};

export const useSetUserScopes = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (scopes: UserScopesUpdate) => {
      const { data } = await apiClient.put<UserScopesUpdate>(
        `/users/${userId}/scopes`,
        scopes,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
    },
  });
};
