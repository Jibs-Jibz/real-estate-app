import React from "react";
import Header from "./Header";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "./Layout";
import { Toaster } from "@/components/ui/sonner";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ClerkProvider>
      <div>
        <Header />
        <Layout>{children}</Layout>
      </div>
      <Toaster />
    </ClerkProvider>
  );
};

export default Provider;
