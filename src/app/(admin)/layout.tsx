import { AdminLayoutWrapper } from "@/app/(admin)/components/Layout/AdminLayoutWrapper";
import AuthGuard from "@/app/(user)/components/User/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAdmin={true}>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </AuthGuard>
  );
}
