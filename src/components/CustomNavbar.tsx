/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Link from "next/link";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../components/ui/resizable-navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useGetKeycloakIdByEmail } from "@/api-1/api1Components";

const CustomNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();
  const { data } = useGetKeycloakIdByEmail({
    pathParams: { email: session?.user.email ?? "" },
  });

  const navItems = [
    {
      name: "Recipes",
      link: "/recipe",
    },
    {
      name: "User Profiles",
      link: "/user",
    },
  ];
  if (
    status === "authenticated" &&
    typeof data === "string" &&
    data.length > 0
  ) {
    navItems.push({
      name: "My Recipes",
      link: `/user/${data}/recipe`,
    });
  }

  const fullLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout");
      const { keycloakLogoutUrl } = await response.json();

      if (keycloakLogoutUrl) {
        // First, sign out locally
        await signOut({
          redirect: false,
        });

        // Then redirect to Keycloak to log out from identity provider
        window.location.href = keycloakLogoutUrl;
      } else {
        // Fallback: just sign out
        await signOut({ callbackUrl: "/" });
      }
    } catch (err) {
      console.error("Logout failed:", err);
      await signOut({ callbackUrl: "/" });
    }
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />

          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {status === "authenticated" ? (
              <>
                <NavbarButton
                  variant="secondary"
                  onClick={async () => {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/account`,
                    );
                    const data = await res.json();
                    router.push(data);
                  }}
                >
                  Account
                </NavbarButton>
                <NavbarButton variant="secondary" onClick={() => fullLogout()}>
                  Logout
                </NavbarButton>
              </>
            ) : (
              <NavbarButton variant="secondary" onClick={() => signIn()}>
                Login
              </NavbarButton>
            )}
            <NavbarButton
              variant="primary"
              onClick={() => router.push("/recipe/post")}
            >
              Post recipe
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              {status === "authenticated" ? (
                <>
                  <NavbarButton
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/account`,
                      );
                      const data = await res.json();
                      router.push(data);
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    Account
                  </NavbarButton>
                  <NavbarButton
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await fullLogout();
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    Logout
                  </NavbarButton>
                </>
              ) : (
                <NavbarButton
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await signIn();
                  }}
                  variant="primary"
                  className="w-full"
                >
                  Login
                </NavbarButton>
              )}
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/recipe/post");
                }}
                variant="primary"
                className="w-full"
              >
                Post recipe
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;
