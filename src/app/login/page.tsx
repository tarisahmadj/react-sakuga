import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getDbHealth } from "@/lib/db";
import SakugaLogin from "@/components/SakugaLogin";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const currentUser = getSessionUser();
  if (currentUser) {
    redirect("/");
  }

  const health = await getDbHealth();
  return <SakugaLogin health={health} />;
}
