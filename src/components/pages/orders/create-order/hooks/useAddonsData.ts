import { API_ENDPOINTS } from "@/constants/endpoints";
import { QUERY_KEYS } from "@/constants/query_keys";
import { useApi } from "@/hooks/apis/useApi";
import { useQuery } from "@tanstack/react-query";
import { AddonGroup } from "../AddonsSheet";
import { useRestaurantStore } from "@/store/restaurantStore";

const useAddonsData = () => {
  const { selectedRestaurantId } = useRestaurantStore();
  const { fetchWithAuth } = useApi();

  const fetchAddonsData = async () => {
    const url = `${API_ENDPOINTS.addonsCollection}/${selectedRestaurantId}/addon-collections/`;
    const response = await fetchWithAuth(url);
    return response;
  };
  const { data, isError, isLoading } = useQuery<AddonGroup[]>({
    queryKey: [QUERY_KEYS.addonsCollection, selectedRestaurantId],
    queryFn: fetchAddonsData,
  });

  return {
    addonsData: data,
    isError,
    isLoading,
  };
};

export default useAddonsData;
