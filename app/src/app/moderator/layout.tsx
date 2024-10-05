"use client";

import { useAuthentication } from "../hooks/useAuthentication";

export default function MemberRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthentication();
  if (user?.role !== "moderator") {
    // return "Not allowed";
    return "";
  }
  return children;
}
