import AdminCustomersClient from "@/components/admin/AdminCustomersClient";
import { getAllCustomers } from "@/lib/firebase/users";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();
  return <AdminCustomersClient initialCustomers={customers} />;
}
