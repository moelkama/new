import type { Metadata } from "next";
import LoginSection from "@/app/auth/login/_components/LoginSection";

export const metadata: Metadata = {
  title: "login page",
  description: "login page description",
};

export default function LoginPage() {
  return <LoginSection />;
}
