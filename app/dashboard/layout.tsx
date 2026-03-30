import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import DashboardFooter from "@/components/layout/DashboardFooter";

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
        <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f8fafc_45%,#f1f5f9_100%)] md:flex">
            <Sidebar />
            <div className="flex min-h-screen flex-1 flex-col">
                <Navbar />
                <main className="flex-1 px-3 pb-6 pt-3 sm:px-6 sm:pt-6 md:px-8 md:pb-8">
                    {children}
                </main>
                <DashboardFooter />
            </div>
        </div>
    );
}
