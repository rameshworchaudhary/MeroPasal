import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">{children}</main>
      </div>
    </AdminGuard>
  );
}
