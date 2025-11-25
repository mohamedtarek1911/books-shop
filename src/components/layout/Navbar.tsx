import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/api/db";
import ProfileMenu from "./ProfileMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import NavbarClient from "./NavbarClient";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import NavbarBrand from "./NavbarBrand";
import NavbarLoginLink from "./NavbarLoginLink";

export default async function Navbar() {
  const session = await getSession();
  const user = session ? getUserById(session.userId) : null;

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-background px-4 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <NavbarBrand />

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:block">
            <NavbarClient />
          </div>

          <LanguageSwitcher />
          <ThemeToggle />

          {user ? <ProfileMenu user={user} /> : <NavbarLoginLink />}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-2 border-t border-border pt-2">
        <NavbarClient />
      </div>
    </nav>
  );
}
