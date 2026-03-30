"use client";

import { usePathname } from "next/navigation";

export default function DashboardFooter() {
    const pathname = usePathname();

    if (pathname === "/dashboard/patients/new") {
        return null;
    }

    return (
        <footer className="px-3 pb-4 pt-2 sm:px-6 md:px-8 md:pb-6">
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 px-4 py-4 text-sm text-slate-600 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)] backdrop-blur sm:px-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-slate-700">Oral Candidiasis Management System</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Patient records, reports, and clinical workflow
                    </p>
                </div>
            </div>
        </footer>
    );
}
