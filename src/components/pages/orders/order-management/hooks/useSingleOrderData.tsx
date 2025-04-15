import { API_ENDPOINTS } from "@/constants/endpoints";
import { QUERY_KEYS } from "@/constants/query_keys";
import { useApi } from "@/hooks/apis/useApi";
import { IOrder } from "@/types/orders";
import { useQuery } from "@tanstack/react-query";
const mockItems = [
  {
    id: 1,
    name: "Caesar big salad",
    image: null,
    description: "Romaine lettuce with croutons and Caesar dressing",
    price: "15.99",
    quantity: 1,
    section: 1,
    is_available: true,
    available_addons: [],
    addons: [1, 2],
  },
];

const useSingleOrderData = (orderId: number) => {
  const { fetchWithAuth } = useApi();

  const fetchOrderData = async () => {
    const url = `${API_ENDPOINTS.getOrders}/${orderId}/`;
    const response = await fetchWithAuth(url);

    return {
      ...response,
      items: mockItems,
    };
    // return response;
  };
  const { data, isError, isLoading } = useQuery<IOrder>({
    queryKey: [`${QUERY_KEYS.getOrders}${orderId}`, orderId],
    queryFn: fetchOrderData,
  });

  return {
    orderData: data,
    isError,
    isLoading,
  };
};

export default useSingleOrderData;
