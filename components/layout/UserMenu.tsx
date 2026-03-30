"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type UserMenuProps = {
    userName: string;
};

const quickLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/patients", label: "Patients" },
    { href: "/dashboard/reports", label: "Reports" },
];

export default function UserMenu({ userName }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const today = useMemo(
        () =>
            new Intl.DateTimeFormat("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
            }).format(new Date()),
        []
    );

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (!menuRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-500 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:scale-[1.02] hover:shadow-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-100"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Open user menu"
            >
                {userName[0]}
            </button>

            {open ? (
                <>
                    <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 flex w-[min(18rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white/98 shadow-[0_28px_70px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                        <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 via-sky-950 to-teal-900 px-4 py-4 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">
                                    {userName[0]}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">{userName}</p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-sky-200">
                                        Clinical access
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            Today
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">{today}</p>
                                    </div>
                                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                                            Status
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-emerald-700">Secure session</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                        Quick access
                                    </p>
                                    <div className="space-y-2">
                                        {quickLinks.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-slate-900"
                                            >
                                                <span>{item.label}</span>
                                                <span className="text-slate-400">Open</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="border-t border-slate-100 bg-white/95 px-4 py-4">
                            <form action="/api/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <path d="m16 17 5-5-5-5" />
                                        <path d="M21 12H9" />
                                    </svg>
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
