import { auth } from "auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "login page",
  description: "login page description",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-4 text-lg">Please login to access this page.</p>
      </div>
    );
  }

  return (
    // let print a message that this page coming soon
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Coming Soon</h1>
      <p className="mt-4 text-lg">This page is under construction.</p>
    </div>
  );
}
