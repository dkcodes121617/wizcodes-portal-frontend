"use client";

import { useEffect, useState } from "react";

import { isAuthenticated } from "@/lib/auth";

export function useIsAuthenticated(): boolean {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(isAuthenticated());
  }, []);

  return signedIn;
}
