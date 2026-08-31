"use client";

import type { ReactNode } from "react";

import { StudentShell } from "@/components/student/StudentShell";

export function StudentLayoutClient({ children }: { children: ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}
