"use client";
import Logo from "@/assets/Logo";
import { Button } from "@/components/ui/button";
import React from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLinks from "./NavLinks";
import { UserButton, useUser } from "@clerk/nextjs";
const Header = () => {
  const path = usePathname();
  const { user, isSignedIn } = useUser();
  return (
    <>
      {path.includes("/sign-in") ||
      path.includes("/sign-up") ||
      path.includes("/auth") ? null : (
        <div className=" sticky top-0 z-10 flex w-full items-center justify-between bg-white p-6 px-10 shadow-sm ">
          <div className=" flex items-center gap-10 ">
            <Logo />
          </div>
          <NavLinks />
          <div className=" flex gap-2 ">
            <Link href="/add-new-listing">
              <Button className=" flex items-center gap-2 ">
                <Plus className=" h-5 w-5 " /> Post Your Add
              </Button>
            </Link>
            {isSignedIn ? (
              // <Button variant="outline">Logout</Button>
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link href="/sign-in">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
