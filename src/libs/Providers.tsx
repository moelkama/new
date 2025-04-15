"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { SessionProvider } from "next-auth/react";
import SessionLoading from "./SessionLoading";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RestaurantProvider } from "@/contexts/RestaurantContext";

export default function Providers({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <SessionLoading>
        <QueryClientProvider client={queryClient}>
          <DndProvider backend={HTML5Backend}>
            <RestaurantProvider>{children}</RestaurantProvider>
          </DndProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionLoading>
    </SessionProvider>
  );
}
