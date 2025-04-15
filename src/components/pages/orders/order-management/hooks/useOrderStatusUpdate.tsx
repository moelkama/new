import { QUERY_KEYS } from "@/constants/query_keys";
import { useApi } from "@/hooks/apis/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateOrderStatusParams {
  status: string;
  orderId: number;
}

const useOrderStatusUpdate = () => {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  const {
    mutate: mutateFn,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async ({ status, orderId }: UpdateOrderStatusParams) => {
      const response = await fetchWithAuth(`/order/${orderId}/update/`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getOrders] });
      toast.success("Order status updated successfully");
    },
    onError: () => {
      console.error("Failed to update order status");
      toast.error("Failed to update order status");
    },
  });

  const updateOrderStatus = (status: string, orderId: number) => {
    mutateFn({ status, orderId });
  };

  return {
    updateOrderStatus,
    isPending,
    isSuccess,
  };
};

export default useOrderStatusUpdate;
