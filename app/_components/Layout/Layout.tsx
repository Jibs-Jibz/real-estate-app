"use client";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const path = usePathname();
  return (
    <div
      className={`
    ${
      path.includes("/sign-in") ||
      path.includes("/sign-up") ||
      path.includes("/auth")
        ? ""
        : "mx-auto w-full max-w-[2560px] px-10 py-10 "
    } `}
    >
      {children}
    </div>
  );
};

export default Layout;
