import { useApi } from "./useApi";
import { useQueryClient } from "@tanstack/react-query";

export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  preferred_language: string | null;
  created_at: string;
  last_login: string;
  is_active: boolean;
  reset_email_uid: string | null;
  reset_email_expiry: string | null;
  role: number;
}

export function useUserData() {
  const { useApiQuery } = useApi();

  return useApiQuery<UserData>("/user/", {
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}

export type UserLoginUpdate = {
  email?: string;
  password?: string;
};

export type UserProfileUpdate = {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  preferred_language?: string | null;
};

export function useUpdateUser() {
  const { useApiMutation } = useApi();
  const queryClient = useQueryClient();

  // Define the context type
  type MutationContext = {
    previousData?: UserData;
  };

  // Update profile details with proper typing
  const updateProfileDetails = useApiMutation<
    UserData,
    UserProfileUpdate,
    MutationContext
  >("/user/update/", "PUT", {
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["/user/"] });

      const previousData = queryClient.getQueryData<UserData>(["/user/"]);

      if (previousData) {
        queryClient.setQueryData<UserData>(["/user/"], {
          ...previousData,
          ...newData,
        });
      }

      // Return typed context
      return { previousData };
    },
    onError: (_err, _newData, context) => {
      // Rollback on error - now correctly typed
      if (context?.previousData) {
        queryClient.setQueryData(["/user/"], context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is up-to-date
      queryClient.invalidateQueries({ queryKey: ["/user/"] });
    },
  });

  // Same fixes for login details - also with proper typing
  const updateLoginDetails = useApiMutation<
    UserData,
    UserLoginUpdate,
    MutationContext
  >("/user/update/", "PUT", {
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["/user/"] });
      const previousData = queryClient.getQueryData<UserData>(["/user/"]);

      if (previousData) {
        queryClient.setQueryData<UserData>(["/user/"], {
          ...previousData,
          ...newData,
        });
      }

      return { previousData };
    },
    onError: (_err, _newData, context) => {
      // Now correctly typed
      if (context?.previousData) {
        queryClient.setQueryData(["/user/"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/user/"] });
    },
  });

  return {
    updateLoginDetails,
    updateProfileDetails,
  };
}
