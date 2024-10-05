"use client";

import { useContext } from "react";
import { AuthenticationContext } from "@/app/contexts/Authentication";

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  return context;
};
