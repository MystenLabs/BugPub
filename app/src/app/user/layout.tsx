"use client";

import { ChildrenProps } from "@/types/ChildrenProps";
import { useAuthentication } from "@/contexts/Authentication";
import { Spinner } from "@/components/general/Spinner";

export default function UserRootLayout({ children }: ChildrenProps) {
  const { user, isLoading } = useAuthentication();

  if (isLoading) {
    return <Spinner />;
  }
  if (user?.role !== "user") {
    // return "Not allowed";
    return "";
  }
  return children;
}

("");
