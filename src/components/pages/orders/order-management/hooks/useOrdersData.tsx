import { API_ENDPOINTS } from "@/constants/endpoints";
import { QUERY_KEYS } from "@/constants/query_keys";
import { useApi } from "@/hooks/apis/useApi";
import { IOrderResponse } from "@/types/orders";
import { useQuery } from "@tanstack/react-query";

const useOrdersData = () => {
  const { fetchWithAuth } = useApi();

  const fetchOrdersData = async () => {
    const url = `${API_ENDPOINTS.getOrders}/`;
    const response = await fetchWithAuth(url);

    return response;
  };
  const {
    data: ordersData,
    isError,
    isLoading,
  } = useQuery<IOrderResponse[]>({
    queryKey: [QUERY_KEYS.getOrders],
    queryFn: fetchOrdersData,
    initialData: [],
  });

  return {
    ordersData: ordersData || [],
    isError,
    isLoading,
  };
};

export default useOrdersData;
