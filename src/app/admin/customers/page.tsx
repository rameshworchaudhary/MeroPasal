import AdminCustomersClient from "@/components/admin/AdminCustomersClient";
import { getAllCustomers } from "@/lib/firebase/users";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();
  const serializedCustomers = JSON.parse(JSON.stringify(customers));
  return <AdminCustomersClient initialCustomers={serializedCustomers} />;
}
