import { redirect } from "next/navigation";
import { getDbHealth, getMissions, getUsers } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import SakugaApp from "@/components/SakugaApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const currentUser = getSessionUser();
  if (!currentUser) {
    redirect("/login");
  }

  const [health, missions, users] = await Promise.all([
    getDbHealth(),
    getMissions().catch(() => []),
    getUsers().catch(() => []),
  ]);

  return (
    <SakugaApp
      initialHealth={health}
      initialMissions={missions}
      initialUsers={users}
      initialUser={currentUser}
    />
  );
}
