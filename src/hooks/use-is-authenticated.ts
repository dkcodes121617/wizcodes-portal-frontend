"use client";

import { useState } from "react";

import { isAuthenticated } from "@/lib/auth";

export function useIsAuthenticated(): boolean {
  const [signedIn] = useState(() => isAuthenticated());

  return signedIn;
}
