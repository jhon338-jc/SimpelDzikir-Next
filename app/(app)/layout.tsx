import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AppProvider } from "@/lib/client/store";
import AppFrame from "@/components/AppFrame";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user
    ? { name: session.user.name || "Muslim", email: session.user.email || "" }
    : null;

  return (
    <AppProvider user={user}>
      <AppFrame user={user}>{children}</AppFrame>
    </AppProvider>
  );
}