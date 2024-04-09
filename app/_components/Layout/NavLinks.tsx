"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = () => {
  const path = usePathname();
  return (
    <ul className=" hidden gap-10 md:flex ">
      <Link href="/">
        <li
          className={` cursor-pointer text-sm font-medium hover:text-primary ${
            path === "/" ? "text-primary" : ""
          } 
      } `}
        >
          For Sale
        </li>
      </Link>
      <Link href="/rent">
        <li
          className={` cursor-pointer text-sm font-medium hover:text-primary ${
            path === "/rent" ? "text-primary" : ""
          }  `}
        >
          For Rent
        </li>
      </Link>
      <Link href="/agent-finder">
        <li
          className={` cursor-pointer text-sm font-medium hover:text-primary ${
            path === "/agent-finder" ? "text-primary" : ""
          }  `}
        >
          Agent Finder
        </li>
      </Link>
    </ul>
  );
};

export default NavLinks;
