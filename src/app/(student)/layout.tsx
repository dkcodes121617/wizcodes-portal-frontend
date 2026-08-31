import type { ReactNode } from "react";

import { StudentLayoutClient } from "@/components/student/StudentLayoutClient";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return <StudentLayoutClient>{children}</StudentLayoutClient>;
}
