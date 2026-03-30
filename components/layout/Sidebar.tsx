"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/dashboard/patients", label: "Patients" },
        { href: "/dashboard/reports", label: "Reports" },
    ];

    return (
        <>
            <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-gray-200 bg-white md:sticky md:top-0 md:flex">
                <div className="border-b border-gray-100 p-6">
                    <h1 className="text-2xl font-bold text-blue-600">Oral Candidiasis</h1>
                    <p className="mt-1 text-sm text-gray-500">Management System</p>
                </div>

                <nav className="flex-1 p-6">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all ${pathname === item.href
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-auto border-t border-gray-100 p-6">
                    <form action="/api/auth/signout" method="post">
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-3 py-2 backdrop-blur md:hidden">
                <ul className="grid grid-cols-3 gap-2">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex min-h-12 items-center justify-center rounded-2xl px-3 text-center text-sm font-medium transition ${pathname === item.href
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
