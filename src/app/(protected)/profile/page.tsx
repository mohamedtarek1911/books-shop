import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/api/db";
import ProfilePageContent from "@/components/profile/ProfilePageContent";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    return (
      <div className="mx-auto max-w-xl p-4">
        <div className="p-6 text-center text-destructive">Unauthorized</div>
      </div>
    );
  }

  const user = getUserById(session.userId);
  if (!user) {
    return (
      <div className="mx-auto max-w-xl p-4">
        <div className="p-6 text-center text-destructive">User not found</div>
      </div>
    );
  }

  return <ProfilePageContent user={user} />;
}
