// app/your-page.tsx or app/layout.tsx
import { auth } from "auth";

export default async function Page() {
  const session = await auth();
  return (
    <div>
      <h1>Welcome to the app!</h1>
      <p>Session: {JSON.stringify(session)}</p>
    </div>
  );
}

