import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
