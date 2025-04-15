import { useApi } from "./useApi";
import { useSession } from "next-auth/react";
import { useQueryClient, Query } from "@tanstack/react-query";
import {
  Day,
  DaySchedule,
} from "@/app/(platform)/settings/_components/Scheduler/Scheduler";

interface ApiRestaurant {
  id: number;
  name: string;
  address: string;
  city?: string;
  postal_code?: string;
  latitude?: string;
  longitude?: string;
  phone_number?: string;
  email?: string;
  opening_hours?: string;
  is_active: boolean;
  store_status?: string;
  image_url?: string;
}

export interface Holiday {
  id: number;
  start_date: string;
  end_date: string;
}

export interface Restaurant {
  id?: number;
  name: string;
  location: {
    address?: string;
    city?: string;
    postalCode?: string;
    coordinates?: {
      lat?: string;
      lng?: string;
    };
  };
  contact: {
    phone?: string;
    email?: string;
  };
  status: {
    isOpen?: boolean;
    isActive?: boolean;
  };
  image?: string;
}

export type HolidayInput = {
  start_date: string;
  end_date: string;
};

export interface OperationContact {
  full_name: string;
  surname: string;
  primary_email: string;
  secondary_email: string;
  phone_number: string;
  whatsapp_number: string;
}

export interface BusinessContact {
  full_name: string;
  surname: string;
  primary_email: string;
  secondary_email: string;
  phone_number: string;
  whatsapp_number: string;
}

interface ApiSchedule {
  mon: { start: string; end: string }[];
  tue: { start: string; end: string }[];
  wed: { start: string; end: string }[];
  thu: { start: string; end: string }[];
  fri: { start: string; end: string }[];
  sat: { start: string; end: string }[];
  sun: { start: string; end: string }[];
}

interface ApiScheduleResponse {
  opening_hours: ApiSchedule;
}

const createQueryInvalidator = (
  restaurantId: number | undefined,
  endpoint: string,
) => {
  return (query: Query) => {
    const queryKey = query.queryKey as unknown[];
    const keyString =
      typeof queryKey[0] === "string"
        ? queryKey[0]
        : JSON.stringify(queryKey[0]);
    return keyString.includes(`/api/restaurants/${restaurantId}/${endpoint}`);
  };
};

const transformApiToSchedule = (
  apiResponse: ApiScheduleResponse,
): DaySchedule[] => {
  const apiSchedule = apiResponse.opening_hours;
  const dayMap: Record<string, Day> = {
    mon: "mon",
    tue: "tue",
    wed: "wed",
    thu: "thu",
    fri: "fri",
    sat: "sat",
    sun: "sun",
  };

  return Object.entries(apiSchedule).map(([dayKey, slots]) => ({
    day: dayMap[dayKey],
    timeSlots: Array(2)
      .fill(null)
      .map((_, index) =>
        slots[index]
          ? { start: slots[index].start, end: slots[index].end }
          : { start: "", end: "" },
      ),
    isExpanded: false,
  }));
};

export function useRestaurants() {
  const { useApiQuery } = useApi();
  const { status } = useSession();

  return useApiQuery<ApiRestaurant[], Restaurant[]>("/api/restaurants/", {
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
    select: (data) =>
      data.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        location: {
          address: restaurant.address,
          city: restaurant.city,
          postalCode: restaurant.postal_code,
          coordinates: {
            lat: restaurant.latitude,
            lng: restaurant.longitude,
          },
        },
        contact: {
          phone: restaurant.phone_number,
          email: restaurant.email,
        },
        status: {
          isOpen: restaurant.store_status === "open",
          isActive: restaurant.is_active,
        },
        image: restaurant.image_url,
      })),
  });
}

export function useRestaurant(restaurantId: number | undefined) {
  const { useApiQuery } = useApi();
  const { status } = useSession();

  return useApiQuery<Restaurant>(`/api/restaurants/${restaurantId}/`, {
    enabled: status === "authenticated" && !!restaurantId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRestaurantHolidays(restaurantId: number | undefined) {
  const { useApiQuery } = useApi();
  const { status } = useSession();

  return useApiQuery<Holiday[]>(`/api/restaurants/${restaurantId}/holidays/`, {
    enabled: status === "authenticated" && !!restaurantId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useHolidayOperations(restaurantId: number | undefined) {
  const { useApiMutation, fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  const invalidateHolidays = createQueryInvalidator(restaurantId, "holidays/");

  const addHoliday = useApiMutation<Holiday, HolidayInput>(
    `/api/restaurants/${restaurantId}/holidays/`,
    "POST",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ predicate: invalidateHolidays });
      },
    },
  );

  const deleteHoliday = (holidayId: number) => ({
    mutateAsync: async () => {
      if (!restaurantId) throw new Error("Restaurant ID is required");

      await fetchWithAuth(
        `/api/restaurants/${restaurantId}/holidays/${holidayId}/`,
        { method: "DELETE" },
      );

      queryClient.invalidateQueries({ predicate: invalidateHolidays });
      return { success: true };
    },
  });

  return { addHoliday, deleteHoliday };
}

export function useRestaurantSchedule(restaurantId: number | undefined) {
  const { useApiQuery } = useApi();
  const { status } = useSession();

  return useApiQuery<ApiScheduleResponse, DaySchedule[]>(
    `/api/restaurants/${restaurantId}/schedule/`,
    {
      enabled: status === "authenticated" && !!restaurantId,
      staleTime: 5 * 60 * 1000,
      select: transformApiToSchedule,
    },
  );
}

export function useUpdateRestaurantSchedule(restaurantId: number | undefined) {
  const { useApiMutation } = useApi();
  const queryClient = useQueryClient();

  return useApiMutation<ApiScheduleResponse, ApiScheduleResponse>(
    `/api/restaurants/${restaurantId}/schedule/`,
    "PUT",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: createQueryInvalidator(restaurantId, "schedule/"),
        });
      },
    },
  );
}

export function useOperationContact(restaurantId: number | undefined) {
  const { useApiQuery } = useApi();
  const { status } = useSession();

  return useApiQuery<OperationContact>(
    `/api/restaurants/${restaurantId}/operation-contact/`,
    {
      enabled: status === "authenticated" && !!restaurantId,
      staleTime: 5 * 60 * 1000,
    },
  );
}

export function useUpdateOperationContact(restaurantId: number | undefined) {
  const { useApiMutation } = useApi();
  const queryClient = useQueryClient();

  return useApiMutation<OperationContact, Partial<OperationContact>>(
    `/api/restaurants/${restaurantId}/operation-contact/`,
    "PATCH",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: createQueryInvalidator(restaurantId, "operation-contact/"),
        });
      },
    },
  );
}

export function useBusinessContact(restaurantId: number | undefined) {
  const { useApiQuery } = useApi();
  const { status } = useSession();

  return useApiQuery<BusinessContact>(
    `/api/restaurants/${restaurantId}/business-contact/`,
    {
      enabled: status === "authenticated" && !!restaurantId,
      staleTime: 5 * 60 * 1000,
    },
  );
}

export function useUpdateBusinessContact(restaurantId: number | undefined) {
  const { useApiMutation } = useApi();
  const queryClient = useQueryClient();

  return useApiMutation<BusinessContact, Partial<BusinessContact>>(
    `/api/restaurants/${restaurantId}/business-contact/`,
    "PATCH",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: createQueryInvalidator(restaurantId, "business-contact/"),
        });
      },
    },
  );
}
