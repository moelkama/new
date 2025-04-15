"use client";
import React, { useEffect, useRef } from "react";
import OrderManagement from "./order-management/OrderManagement";
import { useSearchParams } from "next/navigation";
import OrderCreation from "./create-order/OrderCreation";

const Orders = () => {
  const searchParams = useSearchParams();
  const token = localStorage.getItem("access_token");

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) {
      console.error("No access token found in local storage.");
      return;
    }
    const socketUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL}/?token=${token}`;
    console.log("Attempting to connect to:", socketUrl);

    const ws = new WebSocket(socketUrl);

    ws.onopen = () => console.log("Connection opened");
    ws.onmessage = (e) => console.log("Message received:", e.data);
    ws.onerror = (e) => console.log("WebSocket error:", e);
    ws.onclose = (e) => console.log("Connection closed:", e.code, e.reason);

    socketRef.current = ws;

    return () => ws.close();
  }, [token]);

  const isNewOrder = !!searchParams.get("isNewOrder");

  return <>{isNewOrder ? <OrderCreation /> : <OrderManagement />}</>;
};

export default Orders;
