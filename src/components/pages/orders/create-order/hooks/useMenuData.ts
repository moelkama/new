import { API_ENDPOINTS } from "@/constants/endpoints";
import { QUERY_KEYS } from "@/constants/query_keys";
import { useApi } from "@/hooks/apis/useApi";
import useDebounce from "@/hooks/useDebounce";
import useSearchStore from "@/store/orders/searchStore";
import { useRestaurantStore } from "@/store/restaurantStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

const MENU_ID = "1"; // TODO: same as above
const ITEMS_PER_PAGE = 10;

export function useMenuData(activeSectionId: number) {
  const { selectedRestaurantId } = useRestaurantStore();
  const { fetchWithAuth } = useApi();
  const { searchQuery, isSearching, setIsSearching, resetQuery } =
    useSearchStore();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchSectionData = useCallback(
    async ({ pageParam = 1 }) => {
      const baseUrl = `${API_ENDPOINTS.menu}/${selectedRestaurantId}/menus/${MENU_ID}`;
      let parsedUrl;

      if (debouncedSearchQuery) {
        parsedUrl = `${baseUrl}/articles/?search=${debouncedSearchQuery}&page=${pageParam}&pageSize=${ITEMS_PER_PAGE}`;
        setIsSearching(true);
      } else {
        parsedUrl =
          activeSectionId === 0
            ? `${baseUrl}/articles/?page=${pageParam}&pageSize=${ITEMS_PER_PAGE}`
            : `${baseUrl}/sections/${activeSectionId}/articles/?page=${pageParam}&pageSize=${ITEMS_PER_PAGE}`;
        setIsSearching(false);
      }

      const response = await fetchWithAuth(parsedUrl);
      return response;
    },
    [
      activeSectionId,
      debouncedSearchQuery,
      fetchWithAuth,
      setIsSearching,
      selectedRestaurantId,
    ],
  );

  const queryResult = useInfiniteQuery({
    queryKey: [
      QUERY_KEYS.sectionArticles,
      activeSectionId,
      debouncedSearchQuery,
    ],
    queryFn: fetchSectionData,
    getNextPageParam: (lastPage) => {
      if (lastPage.has_next) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const { refetch } = queryResult;

  useEffect(() => {
    if (debouncedSearchQuery === "" && isSearching) {
      refetch();
    }
  }, [debouncedSearchQuery, isSearching, refetch]);

  const allArticles =
    queryResult.data?.pages.flatMap((page) => page.results) ?? [];

  return {
    ...queryResult,
    allArticles,
    resetQuery,
    isSearching,
  };
}
