"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type NavItem = {
    href: string;
    label: string;
    shortLabel: string;
    icon: ReactNode;
};

const navItems: NavItem[] = [
    {
        href: "/dashboard",
        label: "Dashboard",
        shortLabel: "Home",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
                <path d="M3 12 12 4l9 8" />
                <path d="M5 10.5V20h14v-9.5" />
            </svg>
        ),
    },
    {
        href: "/dashboard/patients",
        label: "Patients",
        shortLabel: "Patients",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <circle cx="9.5" cy="7" r="3.5" />
                <path d="M20 8v6" />
                <path d="M17 11h6" />
            </svg>
        ),
    },
    {
        href: "/dashboard/reports",
        label: "Reports",
        shortLabel: "Reports",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
                <path d="M4 19.5h16" />
                <path d="M7 16V9" />
                <path d="M12 16V5" />
                <path d="M17 16v-4" />
            </svg>
        ),
    },
];

function isActivePath(pathname: string, href: string) {
    if (href === "/dashboard") {
        return pathname === href;
    }

    return pathname.startsWith(href);
}

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setMobileOpen(true);
        window.addEventListener("mobile-nav:open", handleOpen);

        return () => {
            window.removeEventListener("mobile-nav:open", handleOpen);
        };
    }, []);

    return (
        <>
            <aside className="hidden w-80 shrink-0 border-r border-slate-200/80 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_35%,#f8fafc_100%)] md:sticky md:top-0 md:flex md:min-h-screen md:flex-col">
                <div className="border-b border-slate-200/80 px-6 py-7">
                    <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-950 via-sky-950 to-teal-900 p-5 text-white shadow-[0_22px_60px_-38px_rgba(8,47,73,0.9)]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-sky-200">
                            Care System
                        </p>
                        <h1 className="mt-3 text-2xl font-bold tracking-tight">Oral Candidiasis</h1>
                        <p className="mt-2 text-sm leading-6 text-sky-100">
                            Manage records, clinical history, and exports from one calm workspace.
                        </p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-2">
                        {navItems.map((item) => {
                            const active = isActivePath(pathname, item.href);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={[
                                            "flex items-center gap-3 rounded-[1.35rem] px-4 py-3.5 text-sm font-semibold transition-all",
                                            active
                                                ? "bg-slate-900 text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.8)]"
                                                : "text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-sm",
                                        ].join(" ")}
                                    >
                                        <span
                                            className={[
                                                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                                                active
                                                    ? "border-white/15 bg-white/10 text-white"
                                                    : "border-slate-200 bg-white text-sky-700",
                                            ].join(" ")}
                                        >
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="mt-auto border-t border-slate-200/80 px-4 py-5">
                    <form action="/api/auth/signout" method="post">
                        <button
                            type="submit"
                            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <path d="m16 17 5-5-5-5" />
                                <path d="M21 12H9" />
                            </svg>
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {mobileOpen ? (
                <div className="md:hidden">
                    <button
                        type="button"
                        className="fixed inset-0 z-[65] bg-slate-950/35 backdrop-blur-[2px]"
                        aria-label="Close navigation menu"
                        onClick={() => setMobileOpen(false)}
                    />

                    <aside className="fixed inset-y-0 left-0 z-[70] flex w-[min(20rem,86vw)] flex-col border-r border-slate-200/80 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_35%,#f8fafc_100%)] shadow-[0_30px_80px_-35px_rgba(15,23,42,0.6)]">
                        <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-5">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                                    Navigation
                                </p>
                                <h2 className="mt-2 text-lg font-semibold text-slate-900">Menu</h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700"
                                aria-label="Close navigation menu"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
                                    <path d="m6 6 12 12" />
                                    <path d="M18 6 6 18" />
                                </svg>
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto px-4 py-5">
                            <ul className="space-y-2">
                                {navItems.map((item) => {
                                    const active = isActivePath(pathname, item.href);

                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={[
                                                    "flex items-center gap-3 rounded-[1.35rem] px-4 py-3.5 text-sm font-semibold transition-all",
                                                    active
                                                        ? "bg-slate-900 text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.8)]"
                                                        : "text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-sm",
                                                ].join(" ")}
                                            >
                                                <span
                                                    className={[
                                                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                                                        active
                                                            ? "border-white/15 bg-white/10 text-white"
                                                            : "border-slate-200 bg-white text-sky-700",
                                                    ].join(" ")}
                                                >
                                                    {item.icon}
                                                </span>
                                                <span>{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <div className="border-t border-slate-200/80 px-4 py-5">
                            <form action="/api/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <path d="m16 17 5-5-5-5" />
                                        <path d="M21 12H9" />
                                    </svg>
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </aside>
                </div>
            ) : null}
        </>
    );
}
