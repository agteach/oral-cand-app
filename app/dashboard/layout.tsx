import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getCurrentSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50 md:flex">
            <Sidebar />
            <div className="flex min-h-screen flex-1 flex-col">
                <Navbar />
                <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pt-6 md:px-8 md:pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
