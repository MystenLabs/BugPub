// app/src/app/view/layout.tsx
"use client";

import { useAuthentication } from "@/app/hooks/useAuthentication";

export default function MemberRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user } = useAuthentication();
  // if (user?.role !== "user") {
  //   // return "Not allowed";
  //   return "";
  // }
  return children;
}
