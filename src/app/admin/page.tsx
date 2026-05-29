import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminContentList from "@/components/admin/AdminContentList";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session.authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">内容管理</h1>
        <p className="text-sm text-muted-foreground">管理文献笔记和随笔</p>
      </div>
      <AdminContentList />
    </div>
  );
}
