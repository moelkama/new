import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { useSession, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export function useApi() {
  const { data: session, status } = useSession();

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    if (!session?.access) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access}`,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        signOut({ redirect: true });
        return;
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      if (response.status !== 204) {
        return await response.json();
      }
    } catch (error) {
      console.error("API fetch error:", error);
      throw error;
    }
  };

  const useApiQuery = <TData, TResult = TData>(
    endpoint: string,
    options?: Omit<
      UseQueryOptions<TData, Error, TResult>,
      "queryKey" | "queryFn"
    >,
  ) => {
    return useQuery<TData, Error, TResult>({
      queryKey: [endpoint],
      queryFn: () => fetchWithAuth(endpoint),
      // Only run query when session is available
      enabled:
        status === "authenticated" &&
        !!session?.access &&
        options?.enabled !== false,
      staleTime: options?.staleTime || 1000 * 60,
      placeholderData: options?.placeholderData,
      select: options?.select,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message === "Not authenticated") {
          return false;
        }
        return failureCount < 3;
      },
      ...options,
    });
  };

  const useApiMutation = <TData, TVariables, TContext = unknown>(
    endpoint: string,
    method: string = "POST",
    options?: UseMutationOptions<TData, Error, TVariables, TContext>,
  ) => {
    return useMutation<TData, Error, TVariables, TContext>({
      mutationFn: (variables: TVariables) =>
        fetchWithAuth(endpoint, {
          method,
          body: JSON.stringify(variables),
        }),
      ...options,
    });
  };

  return {
    useApiQuery,
    useApiMutation,
    fetchWithAuth,
  };
}
